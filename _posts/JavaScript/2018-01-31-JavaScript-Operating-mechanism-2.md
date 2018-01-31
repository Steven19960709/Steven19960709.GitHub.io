---
layout: post
title: JavaScript运行机制（2）
date: 2018-01-31
tags: [JavaScript]
---

继续上一篇文章的内容。

### Browser进程与Render进程的通信过程

简单来说，当Browser进程受到用户请求，首先需要获取页面内容（例如通过网路下载资源），随后将这个人物通过rendererHost接口传递给Render进程。

当Renderer进程收到接口信息，简单解析之后，就会交给渲染线程，然后开始渲染：

- 渲染线程接收到请求，加载网页开始渲染网页，这其中可能需要Browser进程获取资源和需要GPU进程来帮助渲染
- 如果有DOM操作，可能会发生reflow甚至是repaint。
- 最后render进程将结果传递给Browser

然后Browser进程接收到结果并将结果绘制出来。

### 浏览器渲染流程

1.当在浏览器输入url的时候，浏览器主进程接管，开一个下载线程，然后进行HTTP请求（DNS查询，IP地址寻址等），然后等待响应，获取内容，然后将内容通过RendererHost接口转交给Renderer进程

2.浏览器开始渲染

浏览器内核拿到内容之后，渲染分以下几个步骤：

- 解析HTML建立dom树
- 解析css构建render树（将CSS代码解析成树形的数据结构，然后结合DOM合并成render树）
- 两树结合，计算各元素的尺寸，位置等
- 绘制render树，绘制页面像素信息
- 浏览器会将各层的信息发给GPU，然后GPU将各层合成，显示到屏幕上面

3.完成渲染，加载事件，处理JS逻辑

### 普通图层和复合图层

浏览器的图层一般分为两个大类，普通图层和复合图层。

首先，普通文档流内可以理解为一个复合图层，里面不管添加多少元素，其实都是一个复合图层。（称为默认复合层）

然后，可以通过硬件加速的方式，声明一个复合图层，它会单独分配资源。将一个元素变成一个复合图层（硬件加速），最常用的方式：

- translate3d，translateZ；
- opacity属性/过度动画（执行的过程中才会创建复合层，动画没有开始或结束后元素还会回到原来的状态。
- will-change属性，一般配合opacity与translate使用（只有这两属性会引起硬件加速）
- video，iframe，canvas，webgl等元素

#### 复合图层的作用

一般一个元素开启硬件加速之后会变成一个复合图层，可以独立于普通文档流中，改动后可以避免整个页面重绘，提升性能。

使用硬件加速时，尽可能的使用index，防止浏览器默认给后续的元素创建复合层渲染

具体的原理时这样的：

webkit CSS3中，如果这个元素添加了硬件加速，并且index层级比较低，
那么在这个元素的后面其它元素（层级比这个元素高的，或者相同的，并且releative或absolute属性相同的），会默认变为复合层渲染，如果处理不当会极大的影响性能

简单点理解，其实可以认为是一个隐式合成的概念：如果a是一个复合图层，而且b在a上面，那么b也会被隐式转为一个复合图层，这点需要特别注意

## Event Loop谈JS的运行机制

复习一下，render进程有几个线程，其中有三个：

- JS引擎线程
- 事件触发线程
- 定时触发器线程

然后还有一些需要理解的是：

- JS分为同步任务和异步任务
- 同步任务都在主线程上执行，形成一个执行栈
- 主线程之外，事件触发线程管理着一个任务队列，只要异步任务有了运行结果，就在任务队列之中放置一个事件。
- 一旦执行栈中的所有同步任务执行完毕（此时JS引擎空闲），系统就会读取任务队列，将可运行的异步任务添加到可执行栈中，开始执行。

### 定时器

当调用setTimeout后，并不是JS引擎检测事件，而是有定时器线程控制 的。因为如果是JS引擎来监控的话，由于js是单线程的，如果处于阻塞线程状态就会影响记计时的准确，因此很有必要单独开一个线程用来计时。

什么时候会用到定时器线程？当使用setTimeout或setInterval时，它需要定时器线程计时，计时完成后就会将特定的事件推入事件队列中。

譬如:

    setTimeout(function(){
        console.log('hello!');
    }, 1000);

这段代码的作用是当1000毫秒计时完毕后（由定时器线程计时），将回调函数推入事件队列中，等待主线程执行

    setTimeout(function(){
        console.log('hello!');
    }, 0);

    console.log('begin');

这段代码的效果是最快的时间内将回调函数推入事件队列中，等待主线程执行。注意：执行结果是：先begin后hello!

虽然代码的本意是0毫秒后就推入事件队列，但是W3C在HTML标准中规定，规定要求setTimeout中低于4ms的时间间隔算为4ms。(不过也有一说是不同浏览器有不同的最小时间设定)

就算不等待4秒，就算假设0毫秒就推入事件队列，也会先执行begin（因为只有可执行栈内空了后才会主动读取事件队列）

setTimeout而不是setInterval！！用setTimeout模拟定期计时和直接用setInterval是有区别的。

因为每次setTimeout计时到后就会去执行，然后执行一段时间后才会继续setTimeout，中间就多了误差。（误差多少与代码执行时间有关）

而setInterval则是每次都精确的隔一段时间推入一个事件
（但是，事件的实际执行时间不一定就准确，还有可能是这个事件还没执行完毕，下一个事件就来了）

而且setInterval有一些比较致命的问题就是：

累计效应（上面提到的），如果setInterval代码在（setInterval）再次添加到队列之前还没有完成执行，就会导致定时器代码连续运行好几次，而之间没有间隔。

就算正常间隔执行，多个setInterval的代码执行时间可能会比预期小（因为代码执行需要一定时间）

譬如像iOS的webview,或者Safari等浏览器中都有一个特点，在滚动的时候是不执行JS的，如果使用了setInterval，会发现在滚动结束后会执行多次由于滚动不执行JS积攒回调，如果回调执行时间过长,就会非常容器造成卡顿问题和一些不可知的错误

而且把浏览器最小化显示等操作时，setInterval并不是不执行程序，
它会把setInterval的回调函数放在队列中，等浏览器窗口再次打开时，一瞬间全部执行时

所以，鉴于这么多但问题，目前一般认为的最佳方案是：用setTimeout模拟setInterval，或者特殊场合直接用requestAnimationFrame

事件循环进阶：macrotask与microtask
这段参考了参考来源中的第2篇文章（英文版的），（加了下自己的理解重新描述了下），
强烈推荐有英文基础的同学直接观看原文，作者描述的很清晰，示例也很不错，如下：

https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/

上文中将JS事件循环机制梳理了一遍，在ES5的情况是够用了，但是在ES6盛行的现在，仍然会遇到一些问题，譬如下面这题：

    console.log('script start');

    setTimeout(function() {
        console.log('setTimeout');
    }, 0);

    Promise.resolve().then(function() {
        console.log('promise1');
    }).then(function() {
        console.log('promise2');
    });

    console.log('script end');

它的正确执行顺序是这样子的：

    script start
    script end
    promise1
    promise2
    setTimeout

为什么呢？因为Promise里有了一个一个新的概念：microtask

或者，进一步，JS中分为两种任务类型：macrotask和microtask，在ECMAScript中，microtask称为jobs，macrotask可称为task

它们的定义？区别？简单点可以按如下理解：

macrotask（又称之为宏任务），可以理解是每次执行栈执行的代码就是一个宏任务（包括每次从事件队列中获取一个事件回调并放到执行栈中执行）

每一个task会从头到尾将这个任务执行完毕，不会执行其它

浏览器为了能够使得JS内部task与DOM任务能够有序的执行，会在一个task执行结束后，在下一个 task 执行开始前，对页面进行重新渲染
（task->渲染->task->...）

microtask（又称为微任务），可以理解是在当前 task 执行结束后立即执行的任务

也就是说，在当前task任务后，下一个task之前，在渲染之前

所以它的响应速度相比setTimeout（setTimeout是task）会更快，因为无需等渲染

也就是说，在某一个macrotask执行完后，就会将在它执行期间产生的所有microtask都执行完毕（在渲染前）

分别很么样的场景会形成macrotask和microtask呢？

macrotask：主代码块，setTimeout，setInterval等（可以看到，事件队列中的每一个事件都是一个macrotask）

microtask：Promise，process.nextTick等

再根据线程来理解下：

macrotask中的事件都是放在一个事件队列中的，而这个队列由事件触发线程维护

microtask中的所有微任务都是添加到微任务队列（Job Queues）中，等待当前macrotask执行完毕后执行，而这个队列由JS引擎线程维护
（这点由自己理解+推测得出，因为它是在主线程下无缝执行的）

所以，总结下运行机制：

- 执行一个宏任务（栈中没有就从事件队列中获取）
- 执行过程中如果遇到微任务，就将它添加到微任务的任务队列中
- 宏任务执行完毕后，立即执行当前微任务队列中的所有微任务（依次执行）
- 当前宏任务执行完毕，开始检查渲染，然后GUI线程接管渲染
- 渲染完毕后，JS线程继续接管，开始下一个宏任务（从事件队列中获取）

如图：

<img src="http://outu8mec9.bkt.clouddn.com/blog1.png">

文章讲到这，希望大家能有所收获