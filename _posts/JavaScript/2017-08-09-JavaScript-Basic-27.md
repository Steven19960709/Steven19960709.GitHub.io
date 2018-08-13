---
layout: post
title: JavaScript 零散知识和BOM
date: 2017-08-09
tags: [JavaScript]
---

今天又要在火车上更新博客了，，今天是JavaScript的最后一个内容了。

## DOCTYPE

查看视口的尺寸有两个方法，window.innerWidth/innerHeight IE8及IE8以下不兼容，还有就是document.documentElement.clientWidth/clientHeight ，这个在标准模式下任意浏览器都兼容，最后还有，document.body.clientWidth/clientHeight 这个适用于怪异模式下的浏览器。

这里就涉及到一些关于标准模式和怪异模式的知识了。 

首先我们要知道渲染模式，在多年以前（IE6诞生以前），各浏览器都处于各自比较封闭的发展中（基本没有兼容性可谈）。随着WEB的发展，兼容性问题的解决越来越显得迫切，随即，各浏览器厂商发布了按照标准模式（遵循各厂商制定的统一标准）工作的浏览器，比如IE6就是其中之一。但是考虑到以前建设的网站并不支持标准模式（也可以理解更新前的网页版本），所以各浏览器在加入标准模式的同时也保留了混杂模式（即以前那种未按照统一标准工作的模式，也叫怪异模式）。

三种标准模式的写法：（如果没有写或者写错了就是怪异模式）

三种标准模式的写法

1.<!DOCTYPE html>（直接用这个就可以）

2.<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">

3.<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

## BOM（Browser Object Model）

BOM定义了操作浏览器的接口，它有5个对象：window（操作window），history（操作历史记录），navigator（操作导航栏），screen（操作屏幕的），location（操作地理位置）。

### Window 

alert(): 显示一段消息并有一个确定按钮的弹出框。

close(): 关闭浏览器窗口，通常是配合iframe使用。

open() : 打开一个新的窗口。
	
	var newWindow = window.open('http://www.baidu.com','baidu','width=200px,height=200px');
	
这样就可以得到一个子窗口。我们可以查询它的一些window属性。

属性：

closed: 用来查询是否关闭。通常是查询子窗体是否关闭。

opener: 查询该窗口是在那个窗口打开的。

### navigator

可以区别浏览器和之间的不同。浏览器嗅探。

userAgent: 可以真正区别浏览器是啥。利用正则表达式进行截取后，匹配操作之后，可以知道浏览器是哪个。

online: 查看浏览器是否脱机模式。

platform：浏览器平台。

### screen

返回屏幕的各种参数，分辨率，高度等，但是不兼容。直接略过。

### Hisory

length: 历史记录的长度

方法：

back(): 往后退一次。

forword(): 往前进一次。

go(): 跳转，在历史记录上进行跳转。

### location

hash: 哈希，手动置锚点。后端前端整合。

	location.hash = "only" //可以直接找到锚点的位置。例如在a标签写id，就可以用hash找到。

host: 查询主机名。

href: 完整的URL。

pathname: 返回URL中的路径名部分。
	
assign: 跳转到某个页面。

replace: 新页面代替当前页面。

reload: 刷新页面。
	
## 零碎知识点

写一个方法通过类名取元素。getByClass。弥补IE8的getElementByClassName不好使的缺点。
	
	
	Document.prototype.getByClass = function(target) {
		//先选择出所有的元素，一个一个看它们的类名。如果类名有空格（前面有，后面有，中间有），要去空格。先去两边空格，在判断中间有没有空格。
		var all = document.getElementsByTagName('*');
		var arr = []; //use to handle
		var trim = /^\s+|\s+$/g
		for(var i = 0; i < len; i++){
			var nodeClassName = all[i].className.replace(regSpace, "");//这里需要调试一下正则，以防出错；
			var testArr = nodeClassName.split(" ");
			for(var j = 0; j < testArr.length; j++){
				if(testArr[j] === target){
					arr.push(all[i]);
				}
			}
		}
		return arr;
	}
	
## 带穿插知识点

1.label标签: 输入框聚焦的时候，只能点击文本框，如果点击文本框前的文字却聚焦不了，我们需要将他们连接起来， 使得点击文本都能聚焦。这就需要使用label标签了。
	
	<label for="demo">username:</laebl>
	<input id="demo" type="text" type="input">//label和input绑定在一起
	demo.onclick = function(){
		alert('is easy');
	}

2. 属性映射，一个标签有一些属性，例如id，class等标签先天就有的，不需要我们手动添加，我们称之为特性。但是有些我们可以给他后天添加的属性，它们就不是特性。如果是特性，他们就有一种映射关系，如果利用js修改，它们可以直接在html里面改也发生变，如果是简单的属性，就是我们后天添加的，它们就没有一一对应的关系，在js里面修改，并不会在html里面体现，如果在html里面添加一个简单属性，那么在js里面访问就是undefined。

3.图片预加载和懒加载

网页加载图片的时候，并不是一开始全部都加载出来，而是，用户读到哪才加载到哪（懒加载）。预加载就是在没有读到之前，就尽量加载，加载完在展示，不要加一点显示一点。
	
	var oimg = new Image();//创建一个图片
	oimg.src = "图片地址";
	oimg.onload = function() {
		//加载完才注册事件
		btn.onclick = function (){//点击才会出现图片 实现懒加载
			document.body.appendChild(oimg);
		}
	}

4.cdn 缓存服务器

请求资源的时候，先找到最近的cdn，如果没有，再到总的服务器找所需要的资源。（网络课详细讲）。CDN的多少，确定世界各地访问该资源的速度。我们有时候也需要往cdn上面放东西。

5. 断点调试（重要）

在读html之前如果有js脚本会阻塞文本，如果这时候有有DOM操作会报错。例如

	<script>
		var div = document.getElementsByTagsName('div')[0];
		div.innerHTML = "hehe";//报错，cannot read the property of undefined
	</script>
	<body>
	<div></div>
	</body>

这个时候我们可以使用断点调试。在浏览器的source可以进行调试。里面有很多行，如果在某一行点击一下，相当于断点，这个时候刷新，程序读到哪一行，就会停止。这个有助于我们一步一步排错。类似于我们在页面上写console.log.

6.文档碎片 

页面加载的时候，有重绘（painting）和重排（rendering），我们要减少重排的次数，把需要改变的东西放在文档碎片里面，最后整个文档碎片加到body里面。一个一个放到body里面很耗性能。避免多次重排。

	var df = document.createDocumentFragment();
	df.appendChild(xxx);
	document.body.appendChild(df);

这样就可以减小重排的操作了。

OK，那么所有的JavaScript核心就复习完成了。明天回到哈尔滨就开始上课了。加油！！！




