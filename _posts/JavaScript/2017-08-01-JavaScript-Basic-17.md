---
layout: post
title: DOM基本操作（BOM重叠版）
date: 2017-08-01
tags: [JavaScript]
---

今天我们要讲一下DOM操作，其实这一个部分的内容，有时候是操作浏览器的，所以也可以认为是BOM的内容，这里就称为DOM操作。 

## 查看滚动条的滚动距离

要注意以后所有的W3C标准，IE9以下的浏览器都时具有兼容性问题的。

window.pageXOffset/window.pageYOffset : 返回当前滚动条的滚动距离。X是是水平方向的（横向滚动条），Y是垂直方向的滚动条距离（垂直滚动条）。IE8及IE8以下不兼容。

document.body/documentElement.scrollLeft/scrollTop ：同样是返回滚动条距离，IE能用，但是兼容性每一代IE都不一样，但是肯定的是，他们两只有一个能在同一个浏览器能用，例如用documen.body能用的document.Element就不好使，不好使的那个会返回一个0.我们通常会把它们两个加起来即可。
	
	document.body.scrollLeft  求水平距离
	document.body.scrollTop   求垂直距离
	document.documentElement.scrollLeft : 求水平距离
	document.documemntElement.scrollTop ：求垂直距离 

现在封装一个方法,求滚动条尺寸。

	function getScrollOffset(){
		if(window.pageXOffset){
			return { 
				x : window.pageXOffset,
				y : window.pageYOffset
			}
		}else{
			return {
				x : document.body.scrollLeft + document.documentElement.scrollLeft,
				Y : document.body.scrollTop + document.documentElement.scrollTop
			}
		}
	}

## 查看视口的尺寸

视口指的是可视区窗口。

W3C指定的方法: window.innerWidth / innerHeight IE8以及以下不兼容。

IE浏览器： document.documentElement.clientWidth / clientHeight.标准模式下，任意浏览器都兼容

### 标准模式 

在这里涉及到一个概念，浏览器有两个模式，一个是混杂模式一个是标准模式。为了能让网页的生存周期更长，不至于浏览器升级了就用不了，浏览器就有一个混扎模式，它可以向后兼容，完全符合以前浏览器的标准。 

启动标准，只需在html标签前加<!DOCTYPE html>（文档模式声明dtd），把这个声明删掉就是怪异模式。

回到原题，在标准模式和非标准模式下查看视口尺寸是不一样的，我们需要进一步进行判断。

document.compatMode 返回一个浏览器当前模式。他会返回两个值。

CSS!compat : 标准模式	document.documentElement.clientWidth/clientHeight 标准模式下，任意浏览器都兼容

BackCompat ： 怪异模式	document.body.clientWidth/clientHeight  适用于怪异模式下的浏览器

封装一个方法：
	
	function geteViewpotOffset() {
		if(window.innerWidth){
			return { 
				w : window.innerWidth,
				h : window.innerHeight
			}
		}else if(document.compatMode == "BackCompat"){
			return {
				w : document.body.clientWidth,
				h : document.body.clientHeight
		}else{
			return {
				w : document.documentElement.clientWidth,
				h : document.documentElement.clientHeight
			}
		{
	}


那么今天的内容就先讲到这吧，希望大家能有所收获。晚安！！





















