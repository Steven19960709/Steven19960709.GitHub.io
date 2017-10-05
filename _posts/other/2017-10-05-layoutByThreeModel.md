---
layout: post
title: 多种方法实现三栏布局
tags: [HTML,css,Interview]
date: 2017-10-05
---

作为前端工程师必备技能，掌握多种布局方式，无论是在实际开发中还是面试当中都是基础中的基础。都是必须掌握的，今天就总结一下几种常见的三栏布局和两栏布局的具体实现。

## 三栏布局

三栏布局，就是两边固定，中间自适应的布局方式，在网页中也是很常见的。

例如，淘宝中的，左边商品导航栏，中间是轮播组件，右边是用户登录等一些 生活小组件。

<img src="http://outu8mec9.bkt.clouddn.com/taobao.png">

下面就开始介绍实现方式。

### 浮动方式

最简单的一种方式就是使用浮动元素来进行实现。

    <style>
        
        .left{
            float: left;
            height: 200px;
            width: 100px;
            background: yellow;

        }
        .right{
            width: 200px;
            height: 200px;
            background: green;
            float: right;
        }
        .middle{
            /* width: 500px; */
            margin-right: 220px;
            margin-left: 120px;
            height: 200px;
            background-color: blue;

        }

    </style>
    <body>
            <div class="container">
                    <div class="left"></div>
                    <div class="right"></div>
                    <div class="middle"></div>
            </div>
        
    </body>

这种方式有个缺点就是，根据加载顺序，中间内容是最迟加载完成的，所以是可能会造成大部分空白出现，影响用户体验。

### 触发BFC实现

之前介绍过bfc，简单说来就是一种渲染方式，一种渲染块级元素的方式。浮动元素不会与bfc区域重叠，bfc区域会占据浮动元素原来的位置具体效果可以看[这篇文章](http://leunggabou.com/blog/2017/07/01/CSS-third/)。我们可以利用这一点来进行布局。

     <style>
	.left {
	    float: left;
	    height: 200px;
	    width: 100px;
	    margin-right: 20px;
	    background-color: red;
	}
	.right {
	    width: 200px;
	    height: 200px;
	    float: right;
	    margin-left: 20px;
	    background-color: blue;
	}	
	.main {
	    height: 200px;
	    overflow: hidden;//触发bfc
	    background-color: green;
	}
    </style>
    
    <body>
        <div class="container">
            <div class="left"></div>
            <div class="right"></div>
            <div class="main"></div>
        </div>
    </body>

### 浮动加负margin

    <style>
        .content {
            float: left;
            width: 100%;
        }
        .main {
            height: 200px;
            margin-left: 110px;
            margin-right: 220px;
            background-color: green;
        }
    .left {
        float: left;
        height: 200px;
        width: 100px;
        margin-left: -100%;
        background-color: red;
    }
    .right {
        width: 200px;
        height: 200px;
        float: right;
        margin-left: -200px;
        background-color: blue;
    }	
    </style>
    <body>
        <div class="content">
            <div class="main"></div>
        </div>
        <div class="left"></div>
        <div class="right"></div>
    </body>

这个方法是利用了margin为负的时候产生的后果。。 这个方法好处就是可以是中间的区域优先下载，但是结构比较复杂，如果进出不是很好的，阅读起来也不是很方便。

### 浮动加margin 加定位 

            <style>
			.container {
				margin-left: 120px;
				margin-right: 220px;
			}
			.main {
				float: left;
				width: 100%;
				height: 300px;
				background-color: red;
			}
			.left {
				float: left;
				width: 100px;
				height: 300px;
				margin-left: -100%;
				position: relative;
				left: -120px;
				background-color: blue;
			}
			.right {
				float: left;
				width: 200px;
				height: 300px;
				margin-left: -200px;
				position: relative;
				right: -220px;
				background-color: green;
			}
			</style>
            <body>
                <div class="container">
                <div class="main"></div>
                <div class="left"></div>
                <div class="right"></div>
                </div>
            </body>

这种方法使用了position定位，相对来说结构更加简单，样式相对复杂，但是也是有限加载主体内容。

left的margin-left设置为-100%得到的值是-父元素的宽度，即left将会跑到main的左边。right设置为-200px则是让right移动到main的右边。但同时，由于float属性他们会挡住main的显示。于是需要使用position定位，将left和right分别定位到最左端和最右端。

### flex 布局

    <style>
	.container {
            display: flex;
	}
	.main {
        flex-grow: 1;
	    height: 300px;
	    background-color: red;
	}
	.left {
	    order: -1;//定义项目的排列顺序
	    flex: 0 1 200px;
	    margin-right: 20px;
	    height: 300px;
	    background-color: blue;
	}
	.right {
	    flex: 0 1 100px;
            margin-left: 20px;
	    height: 300px;
	    background-color: green;
	}
    </style>
    <body>
        <div class="container">
        <div class="main"></div>
        <div class="left"></div>
        <div class="right"></div>
        </div>
    </body>

这种方法是最简单，最方便的，也是未来的趋势，但是兼容性不容忽视。

### 绝对定位法

这种方法就是一年前刚刚开始学css的时候讲的方法。
    <style>
        .container {
            position: relative;
        }
        .main {
            height: 400px;
            margin: 0 120px;
            background-color: green;
        }
        .left {
            position: absolute;
            width: 100px;
            height: 300px;
            left: 0;
            top: 0;
            background-color: red;
        }
        .right {
            position: absolute;
            width: 100px;
            height: 300px;
            background-color: blue;
                right: 0;
            top: 0;
        }
        </style>
    <body>
        <div class="container">
            <div class="main"></div>
        <div class="left"></div>
        <div class="right"></div>
        </div>
    </body>


