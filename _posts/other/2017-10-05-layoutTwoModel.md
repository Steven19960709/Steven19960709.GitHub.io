---
layout: post
title: 多种方法实现两列布局
date: 2017-10-05
tags: [Interview,css,HTML]
---

上一篇文章讲了三栏布局，这篇文章就讲一下两列布局吧。其实大体上都是差不多的，主要是用来巩固的。

需求分析，

- 两个盒子处于同一行
- 右侧盒子占满所有空间
- 两个盒子不能重叠

## 浮动加margin

    <style>
        .left{
            background:#fcc;
            width: 200px;
            float: left;
        }
        .right{
            background: #f66;
            margin-left: 210px;
        }
    </style>
    <body>
    <div class="content">
        <div class="left"></div>
        <div class="right"></div>
    </div>    
    </body>

## position定位方式

这种方式html代码是一样的，不再赘述。

    .content{
        position: relative;
        width: 100%;
        height: 500px;
        border: 1px solid #000;
    }
    .left{
        background:#fcc;
        width: 200px;
        position: absolute;
    }
    .right{
        background: #f66;
        position: absolute;
        left: 210px;
    }

## flex 布局

HTML代码一样同样省略

    .content{
        width: 100%;
        height: 500px;
        border: 1px solid #000;
        display:flex;
    }
    .left{
        background:#fcc;
        width: 200px;
        margin-right:10px;
    }
    .right{
        background: #f66;
        flex:1;
    }

## 浮动加触发bfc

    .content{
        width: 100%;
        height: 500px;
        border: 1px solid #000;
    }
    .left{
        background:#fcc;
        width: 200px;
        margin-right: 10px;
        float: left;
    }
    .right{
        background: #f66;
        overflow: hidden;
    }

同样的，BFC区域不会与float box重叠 
所以，left这里为float box，使用overflow：hidden;来触发BFC，这样right就不会与left重叠啦。

## 圣杯布局

这个名字我也不知道是怎样来的，反正就是一种叫法吧。

    <style>
    .content{
        box-sizing: border-box;
        width: 100%;
        padding-left: 200px;
        padding-right: 200px;
    }
    .main{
        background: #f66;
        width: 100%;
        float: left;
        height: 100px;
    }
    .left{
        background:#fcc;
        width: 200px;
        float: left;
        margin-left: -100%;
        position: relative;
        left: -200px;
        height: 50px;
    }
    .right{
        position: relative;
        right: -200px;
        background: #fcc;
        width: 200px;
        float: left;
        margin-left: -200px;
        height: 60px;
    }
    </style>
    <body>
        <div class="content">
            <div class="main">
                中间自适应区域
            </div>
            <div class="left">
                <p>I'am left</p>
            </div>
            <div class="right">
                <p>I'am right</p>
            </div>
        </div>
    </body>
    
有几点需要注意一下： 
1. 中间自适应的区域在结构上要放在left和right之上。 

2. content（即包裹在最外面的那一层div）他必须是box-sizing：border-box。因为只有这样在后面设置其padding值时，他才会把内容里面的三个div全部挤进来而不是扩充出去。 

3. 负margin的使用原理是对float元素移动到上面。left的margin-left设置为-100%得到的值是-父元素的宽度，即left将会跑到main的左边。right设置为-200px则是让right移动到main的右边。但同时，由于float属性他们会挡住main的显示。 

4. 于是需要使用position定位，将left和right分别定位到最左端和最右端。

## Double模式

这个名字是我自己起了，原材料说的是什么双飞模式，听的就会引起乱想。。叫double算了。

    <body>
        <div class="content">
            <div class="main">
                <div class="main_content">
                    中间自适应
                </div>
            </div>
            <div class="left">
                <p>I'am left</p>
            </div>
            <div class="right">
                <p>I'am right</p>
            </div>
        </div>
    </body>
    *{
        padding: 0;
        margin: 0;
    }
    .content{
        box-sizing: border-box;
        width: 100%;
    }
    .main{
        width: 100%;
        float: left;
    }
    .main_content{
        background: #f66;
        margin: 0 200px;
        height: 100px;
    }
    .left{
        background:#fcc;
        width: 200px;
        float: left;
        margin-left: -100%;
        height: 50px;
    }
    .right{
        background: #fcc;
        width: 200px;
        float: left;
        margin-left: -200px;
        height: 60px;
    }

那么今天的内容就讲到这，希望大家能有所收获。