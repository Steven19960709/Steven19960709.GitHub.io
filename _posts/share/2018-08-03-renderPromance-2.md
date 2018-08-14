---
layout: post
title: 渲染性能（2）
date: 2018-08-03
tags: [share]
---

### 优化绘制与合成

绘制是填充像素的过程，像素最终合成到用户的屏幕上。 它往往是渲染过程中运行时间最长的任务，应尽可能避免此任务。合成是将页面的已绘制部分放在一起以在屏幕上显示的过程。这两个过程通常需要放在一起优化，而且是渲染过程中最需要关注的优化点，所以一起来详细阐述下。在介绍优化之前，我们要了解一下Blink的渲染基础知识，再来回顾一下之前放的一张图。

<img src="http://ovk2ylefr.bkt.clouddn.com/render2.png">

具体步骤:

1.Nodes 和 DOM树

网页内容在Blink内部以Node为节点的树形结构存储，称为DOM树。网页中的每一个HTML 元素，包括元素之间的text都和一个Node相关联。DOM tree的最顶层Node 永远是Document Node.

2.From Nodes to RenderObjects

DOM树中每一个可视化的Node 节点都对应着一个RenderObject。RenderObject 也存储在一棵对应的树结构中，称为Render树。

RenderObject 知道如何在一个显示设备上绘制(paint) Node 节点的内容。它通过调用GraphicsContext提供的绘制接口来完成绘制过程。GraphicsContext最终负责将像素写入一块bitmap，这块bitmap会被显示在屏幕上。在Chrome中，GraphicsContext 封装了Skia( 2D图形库)。

之前对GraphicsContext的大多数调用都转变成对SkCanvas或SkPlatformCanvas的接口调用。不过为了把绘制的实际过程移出主线程(后面会详细讲)，现在这些调用命令被替换成记录到SkPicture。SkPicture是一个能够记录command，最后可以replay这些command的有序数据结构，类似于display list。

3.From RenderObjects to RenderLayers

每一个RenderObject 都关联着RenderLayer。这种关联是通过祖先RenderObject 节点直接或间接地建立的。分享同一坐标系的RenderObject(比如被同一CSS transform属性影响的元素)必然位于同一RenderLayer。

正是由于RenderLayer的存在，网页上的元素才可以按照正确的顺序合成，从而恰当的显示有交叠的内容，和半透明元素等效果。通常来讲，满足下列条件之一时，RenderObject就会创建RenderLayer:

- 根节点
- 有明确的CSS定位属性(relative, absolute)
- 透明的（opacity 小于 1）
- 有overflow, an alpha mask or reflection
- 有CSS filter
- 有2D加速Context或者3D(webGL)context的 canvas 元素对应的
- 有video元素的

需要注意的是RenderObject和RenderLayer之间并不是一一对应的。 RenderObject 或者与它所创建的RenderLayer相关联(如果它创建了的话)，或者与它的第一个拥有RenderLayer的祖先RenderObject创建的RenderLayer相关联。

RenderLayer 也会形成一个树型层次结构。这个树结构的根节点是与网页的根元素相对应的RenderLayer。每一个RenderLayer 节点的后代都是包含在父亲RenderLayer内的可视化的RenderLayer.

每一个RenderLayer的子节点都被存储在两个按升序排列的有序表中。negZOrderList 有序表中存储的子节点是z-index值为负的子RenderLayer，所以这些RenderLayer在当前RenderLayer的下面；posZOrderList有序表中存储的子节点是z-index值为正的RenderLayer，所以这些RenderLayer在当前RenderLayer的上面。

事实上，在老版本的chrome里(15年之前)，有一个软件渲染路径的概念，就是不需要硬件加速的情况下，渲染到这里结束了，放一张图来简单了解一下。

<img src="http://ovk2ylefr.bkt.clouddn.com/render5.png">

4.From RenderLayers to GraphicsLayers

为了有效利用GPU硬件加速渲染，Blink又引入了一个新的GraphicsLayer，并且专门独立了一个专门的Compositor(合成器) Thread来管理GraphicsLayer以及协调帧的生命周期(后面会专门介绍这个合成器)。作为一个前端开发，你会经常听到用transform: translateZ(0)来开启所谓的硬件加速，实质上就是提升成了GraphicsLayer。

每一个RenderLayer或者拥有自己的GraphicsLayer(如果这个RenderLayer是compositing Layer的话)，或者是使用它的第一个拥有GraphicsLayer的祖先节点的GraphicsLayer.

RenderLayer与GraphicsLayer的关系类似于RenderObject与RenderLayer之间的关系。每个GraphicsLayer都拥有一个GraphicsContext，与这个GraphicsLayer相对应的每个RenderLayer都绘制到这个GraphicsContext上。合成器会负责将多个的GraphicsContext输出的位图最终合成一个最终的image。

理论上讲，每一个RenderLayer都可以将自己绘制到一个单独的backing surface上以避免不必要的重绘。但是在实际中，这种做法会导致内存的大量浪费(尤其是VRAM)。在当前的Blink实现中，只有满足以下条件之一，RenderLayer才会拥有它自己的compositing layer。

    layer 有3D或者perspective transform 属性值
    layer是硬解码的video 元素使用的
    layer是拥有3D context或2D加速context的Canvas标签使用的
    layer是一个合成的插件使用的
    layer使用了动画表示它的透明度，或者使用了动画形式的webkit 变换
    layer 使用了加速的CSS 滤镜
    拥有compositing layer后代的layer
    渲染在compositing layer之上的layer(overlap)

5.Layer Squashing

overlap引起的合成层提升经常出现，就会导致有很多的合成层，岂不是会造成内存大量浪费，所以Blink专门有Layer Squashing(层压缩)的处理。


每一个GraphicsLayer都有对应的Composite Layer，这样Chrome的合成器才知道如何对这个GraphicsLayer进行处理，下面我们就来阐述下什么是合成器。

#### 合成器

Chrome的合成器是一个用来管理GraphicsLayer树和协调帧的生命周期的软件库。最初合成器也是被设计在渲染进程的主线程中的，现在合成器被拆成了两部分，一半在主线程里面，负责绘制(painting)，主要工作就是把layer树的信息记录到SkPicture中，并没有实际上产生像素；另一半变成了单独的Compositor Thread(简称为cc)，也被称为impl thread，这部分是真正的drawing，负责将painting中记录的layer信息经过光栅，合成等操作，最终显示到屏幕。下面分步骤来详细阐述合成器的工作。

1.Recording: Painting from Blink’s Perspective

兴趣区域(interest area)是要被记录到SkPicture中的viewport附近的区域。每当DOM元素改变，Blink会把兴趣区域中失效的部分layer树信息记录到 SkPicture-backed GraphicsContext。记住，这一步并没有真正的绘制像素，只是记录了可以replay出像素的命令的一个display list。

2.The Commit: Handoff to the Compositor Thread

合成器线程的一个关键特性就是它维护了主线程状态的一个复制，因此可以根据这个复制来生成帧而不用去询问主线程。主线程的状态信息就是一个LayerChromiumtree，对应的合成器线程复制的是CCLayerImpltree，这两棵树理论上是彼此独立的，这就意味着合成器线程可以在主线程阻塞的情况下使用当前的复制信息执行drawing内容到屏幕。
而当主线程产生了新的兴趣区域，合成器线程如何知道去修改它所维持的树的状态了？合成器线程有一个专门的调度器，使用commit来定期同步两棵树的状态。commit会将主线程更新过的LayerChromiumtree的状态以及新的SkPicture命令传给合成器线程，并同时block主线程来达成同步。这也是主线程在一个帧的生成过程中的最后一步。由于合成器线程独立于主线程，而且专门负责实际的drawing，所以浏览器传来的用户输入都是直接传到合成器线程的，一些不需要主线程参与的交互，例如用户键盘输入等，合成器线程可以直接处理完成页面的更新，但是如果主线程注册了事件的回调，这时候合成器线程就必须将更新的CCLayerImpltree状态以及一些额外任务反向commit给主线程。

3.Tree Activation

当合成器线程通过主线程的commit同步到更新后的layer tree信息后，会检查哪些layer是失效的并且重新光栅化这些layer。这时active tree是合成器线程保留的上一帧的layer tree信息，而新光栅化的layer tree信息被称为pending tree。为了保持展示内容的一致性，只有当pending tree已经完全光栅化后才会转换成新的active tree，从pending到active的过程被称为tree activation。
需要注意的非常重要的一点是有可能屏幕会滚动到当前的active tree之外，因为主线程只记录viewport周围的兴趣区域。这个时候合成器线程就会询问主线程去记录和commit新区域的信息，但是如果新的pending tree没能及时激活，用户就会滚动到一个所谓的 checkerboard zone。

为了减轻checkerboard zone，chrome将pending tree的光栅化分成低分辨率的部分和高分辨率的部分，当要出现checkerboard zone的时候优先光栅化低分辨率的部分并激活用来展现，这也就是为什么有时候有些页面在快速滚动时候会变模糊(例如google地图)。这部分工作是一个专门的tile manager来管理的(下一节的内容)。

4.Tiling

光栅化整个页面的layer tree是非常浪费CPU和内存的，所以合成器线程将layer tree分割成多个小的tile，设定好各个tile的优先级(根据离viewport的远近等因素来设置)，并且专门创建了tile worker线程(一个或者多个)来执行这些tile的光栅化。在chrome的performance分析中能看到页面的tile，如图所示，勾选rending选项中的红色区域，就能看到页面中绿色border的tile。

5.Rasterization: Painting from cc/Skia’s perspective

主线程记录的SkPicture的display list，合成器线程通过两种方式来转变成最终上传到GPU的纹理(texture)。一种是基于CPU、使用Skia库的Software Rasterization，首先绘制进位图里，然后再作为纹理上传至GPU。这一方式中，Compositor Thread会创建出一个或多个Compositor Tile Worker Thread，然后多线程并行执行SkPicture records中的绘画操作，以之前介绍的Graphics Layer为单位，绘制Graphics Layer里的Render Object。同时这一过程是将Layer拆分为多个小tile进行光栅化后写入进tile对应的位图中的。另一种则是基于GPU的Hardware Rasterization，也是基于tile worker线程，也是分tile进行，但是这个过程不是像Software Rasterization那样在CPU里绘制到位图里，然后再上传到GPU中作为纹理。而是借助Skia’s OpenGL backend (Ganesh) 直接在GPU中的纹理中进行绘画和光栅化，填充像素。

6.Drawing on the GPU

一旦所有的纹理已经被填充，GPU进程就能使用深度优先遍历来遍历layer树的信息，然后调用GL/D3D命令来draw每个layer到帧的缓冲池，当然实际上每个layer的drawing还是分成tiles来进行的。下面这张图展示了GPU进程如何进行drawing。

<img src="http://ovk2ylefr.bkt.clouddn.com/render6.png">

好了，到这里整个Compositor的部分阐述完了，我们也就知道了如何对帧渲染步骤中的绘制和合成来进行优化了—将页面频繁变化的部分提升到合成层，通常使用transform: translateZ(0)，利用GPU渲染加速来进行合成。总结下，主要有以下几个优点。

- 合成层的位图，会交由 GPU 合成，比 CPU 处理要快
- 当需要 repaint 时，只需要 repaint 本身，不会影响到其他的层
- 对于 transform 和 opacity 效果，不会触发 layout 和 paint

<img src="http://ovk2ylefr.bkt.clouddn.com/render7.jpg">

注意并不是每一帧中这些步骤都会发生，最多的步骤如下:

- Frame Start. 合成器线程收到来自浏览器的Vsync信号和Input data，一帧开始。
- Input event handlers. Input data被合成器线程传给了主线程，注册的事件回调被执行，注意这里合成器线程做了优化，保证一帧中最多只会触发一次event handler，所以自带了requestAnimationFrame的节流效果。
- requestAnimationFrame. 如果之前注册了raf回调，会在这里执行，这是最完美的执行更新视觉的地方。唯一要注意的就是避免发生强制布局，即导致样式计算和布局提前(红线所示)。
- Parse HTML. 新增的html会在这里被解析，生成对应DOM元素。大部分你会在page load和appendChild之类操作后见到它。
- Recalc Styles. 如果你在JS执行过程中修改了样式或者改动了DOM，那么便会执行这一步，重新计算指定元素及其子元素的样式。
- Layout. 如果有涉及元素位置信息的DOM改动或者样式改动，那么浏览器会重新计算所有元素的位置、尺寸信息。
- Update Layer Tree. 这一步实际上是更新Render Layer的层叠顺序关系，保证层叠的正确。
- Paint. paint操作实际上有两步，第一步是主进程将layer tree的相关信息记录到SkPicture中，类似一个display list；第二部是合成器线程replay这个记录list来光栅化和填充上传纹理。主线程的paint只是第一步。
- Composite. 这里其实也分两步，主线程这里计算出每个Graphics Layers的合成时所需要的data，包括位移（Translation）、缩放（Scale）、旋转（Rotation）、Alpha 混合等操作的参数，然后就是图中我们看到的第一个commit，主线程通知合成器线程去同步layer tree的信息。然后主线程此时会去执行requestIdleCallback。这一步并没有真正对Graphics Layers完成位图的composite。
- Raster Scheduled and Rasterize。 第8步生成的SkPicture records在这个阶段被执行。合成器线程创建出若干个Compositor Tile Worker Thread，利用CPU软件光栅化或者GPU的硬件光栅化，最终将纹理写入了GPU内存中。
- Frame End. 合成器线程已经完成paint和composite的工作，这时会发送一个commit给GPU进程，告诉他可以进行draw了，同时会传达主线程一个commit done，如果一个帧中视觉的变化没有主线程参与，这里合成器线程也会同步更新后的合成器layer tree信息给主线程。
- draw. GPU进程按照深度优先遍历将最后的纹理draw到帧缓冲区，等待显示器的下一个Vsync到来时去显示。

最后，渲染性能的优化，需要结合performance，针对性能低的地方，有针对性的优化，不能为了优化而优化。

那么这部分的内容就讲到这，希望大家能有所收获！