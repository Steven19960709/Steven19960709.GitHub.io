---
layout: post
title: 移动开发适配
date: 2018-03-15
tags: [share]
---

- 手机端页面也称H5页面，因为完全兼容h5。
- 跨平台
- webview，基于Webkit，告别IE
- 更高的适配和性能要求

常见移动适配方法：

PC端：

- 顶宽高垂直居中
- 盒子模型定稿顶宽
- display-inlineblock

移动web: 

- 定高，宽度百分比
- flex
- Media Query（媒体查询）

要与CSS3的结合。

rem原理与简介：

rem是一个字体单位，值是根据HTML根元素大小而定，同样是可以作为宽度，高度等单位。

适配原理：将px替换成rem，动态修改HTML的font-size适配。

兼容性：IOS 6 以上和Android 2.1以上。

meta标签，name是viewport，width，initial-scale，userscalable=no。防止手机中网页放大和缩小。

可以通过修改默认font-size的大小来改变html根元素的大小。

动态修改font-size，

1.媒体查询

    @media screen and (max-width: 360px) {
        html {
            font-size: 20px;
        }
    }
    @media screen and (max-width: 320px) {
        html {
            font-size: 24px;
        }
    }
    @media screen and (max-width: 300px) and (min-width: 321px) {
        html {
            font-size: 28px;
        }
    }

2.使用JS

    // 获取视窗宽度
    let htmlWidth = document.documentElement.clicntWidth || document.body.clientWidth;
    // 获取视窗高度
    let htmlDom = document.getElementsByTagName('html')[0];
    htmlDom.style.fontSize = htmlWidth / 10; // 目的是让rem动态变化

3.rem基本概念

rem的基准值就是之前说过的html的基本字体。有些html会把meta里面的scale修改。


