---
layout: post
date: 2017-06-30
title: 前端基础（6）———margin塌陷和margin合并
categories: blog
tags: [CSS]
---

鉴于现在到了期末阶段了，博主也要开始“预习”，可能不会每天都更新博客，大家有什么不懂的可以留言，我尽量隔天更新吧。

好，今天来继续给大家讲讲css的一些重要问题，也是一些重要的bug。

由浅入深。我们先来介绍一下css的盒模型。

## css盒模型

首先来了解一些概念。

1.content：内容区，大小为width x height。

2.padding：内边距，用来进行分隔边框和content，可以理解为缓冲位置。分上下左右四部分，设定的时候可以这样写

    padding:30px;(表示上下左右全部为30px;);

    padding:30px 20px 10px 20px;(顺序为 上右下左，进行设定内边距）;

    padding:50px 20px 30px;(顺序为 上 左右 下）;

也可以通过 padding-left 这样的形式进行单独得设定。
    

3.border：边框。

    border-width:15px;
    border-style:solid;
    border-color:balck;

style表示的是边框的样式为实线，颜色为黑色，边框粗细为15像素，border设定粗细的时候顺序问题跟padding是一样的。另外有一点要注意的是，当分别为border设定粗细的时候，要这样写：

    border-left-width:90px;
    
要先确定方向，在设定粗细。

4.margin：外边距，设定盒子与盒子之间的距离。可以单独设置。

最后来一张图进行了解。

<img src="http://os310ujuc.bkt.clouddn.com/clipboard.png">

ok,那么现在就开始讲一讲一个盒子究竟包含的哪些部分呢？

    <div>12345</div>
      div{
      width:100px;
      height:100px;
      background:red;
      padding:50px;
      margin:50px;
      border:10px solid;
    }
    
运行以上代码，我们可以看到，变红色是padding和content，border为黑色。现在的浏览器都是这样的样式，要注意的是，在IE6设置的话，border也是红色。这是一个很重要的兼容性例子。大家平常开发的时候就要注意了。

## margin塌陷问题和合并问题。

到目前为止，css都有一个很大的bug没有被修复，它们就是著名的margin塌陷和margin合并。

### margin塌陷 

先来一段代码。

    <div class='father'>
      <div class='son'>
      </div>
     </div>
     
     .father{
       width:200px;
       height:200px;
       background:yellow;
       }
       .son{
       width:100px;
       height:100px;
       background:green;
       }

现在显示为

<img src="http://os310ujuc.bkt.clouddn.com/bug1.png">

当我们在son里面写上这段代码之后。

    .son{
    width:100px;
    height:100px;
    background:green;
    margin-top:50px;
    }
    
我们惊奇地发现，既然变成这样：

<img src="http://os310ujuc.bkt.clouddn.com/bug.PNG">

我们在捋一捋是什么个情况，我们给子元素加上绿色，父元素为黄色，理论上我们给子元素设置margin-top，绿色顶部应该跟黄色会产生一段距离，但是现在的问题就是，子元素带动父元素一起移动了50px。这就是margin塌陷问题。在垂直方向上，给子元素设定margin的时候不按正常规则来进行，其实这里是跟父元素和子元素的margin大小有关系，假如我们在父元素上也设置一个margin-top，当子元素margin-top小于父元素设定的值的时候，子元素是不会动的。只有大于父元素设定的时候才会带动父元素一起动。

这里还有一个例子就是body本身也会存在margin塌陷的问题，这个究竟是什么问题呢，这我就不展开了，大家要是有兴趣可以自行gooooooole。也可以留言哈。

#### 解决方法

当然，出现问题，肯定会有方法解决的。解决margin塌陷的问题，我们要利用bfc-block format content进行解决。

什么是bfc呢？简单来说，每一个盒模型都会有它们默认的一套渲染机制，就是我们平常用的都属于它们的默认渲染机制，在这套机制里面，会存在margin塌陷的问题，这时候，我们需要利用另一套渲染机制来进行渲染，这就叫做 利用触发bfc了。
**那怎样触发bfc呢？

****1.overflow：hidden；
2.position：absolute；
3.float浮动等。

对于上述例子，只要我们在父级father触发bfc即可，操作方法如下。

    .father{
       width:200px;
       height:200px;
       background:yellow;
       overflow:hidden;
       }
   
操作完成之后，我们在重新进入以下页面，尽可以看见正常位置的son了。

--------------------------------------------------------------

吃饱饭继续来完成今天的内容。讲完margin塌陷之后，我们就要讲一下margin合并了。

## margin合并

margin合并讨论的就不是父子结构了，讨论的是兄弟结构。简单来说，就是当两个并列的结构，一个设定了margin-bottom,另外一个设定了margin-top，这两个
取的是更大的一个，它们并不会产生更大的间距。这时候我们需要在其中一个兄弟元素中套上一个父级标签，对父级标签触发bfc即可解决这个问题。但是通常
我们不会通过这种方法解决margin合并的问题，因为这样会带来其他的反效果。我们会通过通过再次设定margin的方法解决这个问题。

##层模型

说道层模型，大家可能就会想到盒模型，但是层模型根盒模型真的不是一回事，听我慢慢给你介绍吧。

1.首先来了解一下定位。position，它有以下几个值，static，absolute，relative。

当一个元素设定了
    
    position:absolute；
    
 表示它已经成为一个定位元素了，它的特点就是，脱离原来的位置，相对于最近的有定位的父级元素进行定位，如果没有有定位的元素，它就会相对于浏览器进行定位。
 
 当然啦，一个它还要结合left/right ，和top/bottom ，来进行设置才能出现咱们想要的页面效果。那为什么要称之为层模型呢？请看下面例子。
 
     <div class='first'></div>
     <div class='second'></div>
     
     .first{
        position:absolute;
        left:100px;
        top:
        width:100px;
        height:100px;
        background:yellow;
        }
     .second{
         position:absolute;
         left:50px;
         top:50px;
         width:100px;
         height:100px;
         background:green;
         }
 
 来看一下效果，
 
 <img src="http://os310ujuc.bkt.clouddn.com/first.PNG">
 
 现在是绿色的在上层，黄色在下层，这主要是跟他们的编码顺序有关系，简单来说，left和top就相当于X轴Y轴，怎样设定z轴？通过z-index来进行设定，
 就好比z-index=0就是在地下，z-index=1就是上面一层。我们来操作一下。
 
 其他属性保持不变，进行z-index设置。
 
     .first{
        z-index:1;
        }
     .second{
         z-index:0;
         }

于是就出现这种情况：

<img src="http://os310ujuc.bkt.clouddn.com/second.PNG">

这时候黄色就变成在绿色上方了。所以称之为层模型。真的挺形象的有么有。哈哈哈。

2.OK,继续来介绍relative，这个地位跟absolute定位就有很大差异了，首先它不会脱离原来的文档流，并且，它是想对他自己原来的位置进行定位。当使用了

position:relative;进行定位的时候，元素首先会出现在自己的位置上，然后再根据left，top的值，以自己原来的位置进行定位。

3.position:fixed,相对于可是窗口进行定位，典型的例子就是顽皮的小广告，窗口无论怎样往下走，他都是固定的位置，不会动弹。

OK，最后介绍一下， 在我们进行定位的时候，要使用relative作为参照物，利用absolute进行定位。这样可以使参照物保留原来位置不动。

今天的博客就完事啦，记得点赞哦。








    
