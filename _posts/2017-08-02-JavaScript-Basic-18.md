---
layout: post
title: 前端核心知识（27）———JavaScript DOM滚动条操作和CSS脚本化
date: 2017-08-02
tags: [JavaScript]
---

在讲今天的内容之前，需要写一个函数，来判断各种数据类型，包括包装类。

		function type(target){
			var typeStr = typeof(target),
				toStr = Object.prototype.toString,
				objStr = {
					"[object Object]" : "object - Object",
					"[object Array]" : "array - Object",
					"[object Number]" : "number - Objcet",
					"[object Boolean" : "boolean - Object",
					"[object String]" : "string - Object"
					
				}
			if(target === null) {//判断null直接 看是不是等于 null即可，利用call会报错
				return null;
			}else if(typeStr === "function"){
				return "function";
			}
			if(typeStr === "function"){
				return "function";
			}
			if(typeStr !== " object"){
				return typeStr;
			}else {
				return objStr[toStr.call(target)]; //判断最后的对象 对应的类型。
			}
			
这个讲完之后就继续今天的内容。

## 查看元素的几何尺寸
	
	<div style="position:absolute;left:100px;top:100px;width:100px;height:100px;background-color:red;"></div>
	
	var div = document.getElementsByTagName('div')[0];//供以后操作

1,div.getBoundingClientRect() :返回一个对象，里面所含所有的属性就是，该元素的坐标位置。兼容性很好。height和width属性老版本的IE并未实现，我们可以利用减法right-left和bottom-top实现。另外，返回的结果并不是“实时的”，就是后期利用JS改了，属性还是一开始它的值。width和height指的是盒子的内容区。

<img src="http://os310ujuc.bkt.clouddn.com/blog11.PNG">
	
2.元素的尺寸：dom.offsetWidth，dom.offsetHeight，获取宽和高尺寸。

3.看元素的位置：dom.offsetLeft, dom.offsetTop。

对于无定位父级的元素，返回相对文档的坐标。对于有定位父级的元素，返回相对于最近的有定位的父级的坐标。

4.dom.offsetParent ：返回最近的有定位的父级，如果没有，返回body, body.offsetParent 返回null。
eg：求元素相对于文档的坐标getElementPosition()。（思考题，利用递归）


## 让滚动条滚动

window上有三个方法：scroll(),scrollTo() scrollBy();功能类似，用法都是将x，y坐标传入。即可实现让滚动轮滚动到当前位置。

	window.scroll(0,100)   // 移动到0,100的点上
	window.scroll(0,1000)  //移动到0,1000的点上
	window.scrollTo(0,1000) //移动1000个像素，并不是移到点上。

利用scrollBy(),方法可以进行一个阅读器的程序编写。

	<button style="width:50px;height:50px;border-radius:50%;box-shadow:1px 2px 3px #000;background:yellow;opacity:0.7;position:fixed;bottom:150px;right:50px;">start</button>
	<button style="width:50px;height:50px;border-radius:50%;box-shadow:1px 2px 3px #000;background:yellow;opacity:0.7;position:fixed;bottom:50px;right:50px;">stop</button>
	<button style:"width:50px;height:50px;border-radius:50%;box-shadow:1px 2px 3px #000;background:yellow;opacity:0.7;position:fixed;bottom:250px;right:50px"> 
	
	var start = document.getElementsByTagName('button')[0];
	var stop = document.getElementsByTagName('button')[1];
	var speed = 1;
	start.onclick = function(){
		clearInterval(timer);  //如果不清，就会有加速效果。
		setInterval(function(){
			window.scrollBy(0,speed);
		},50);
	}
	stop.onclick = function () {
		clearInterval(timer);
	}
	su.onclick = function () {
		if(speed < 5) {
			speed ++;
		}
	}

## 脚本化CSS

### 取行间样式
间接地操作CSS,但是看起来更加直观。
	
	<div style="width:100px;height:100px;background:red;"></div>
	var div = document.getElementsByTagName('div')[0];
	
div.style : 获得一个类数组:CSSStyleDeclaration。下面显示的是所有能够赋值的css属性。索引位为自己的已有的css属性，如题是单位0 ，1,2分别值为100,100，red。

1.在利用JavaScript调用CSS属性的时候，多个单词复合属性要利用小驼峰是写法：backgroundColor。不然会报错，写成这样：background-color，系统会认为是“-”是减号。

2.利用style除了查询，还能进行修改赋值，而且是唯一方法，没有任何兼容性问题。

3.如果遇到保留字，例如：float，需要加上css前缀，写成这样，CSSFloat。

4.另外写入的值必须是字符串格式。

5.复合属性需要拆解。borderWidth,borderColor这样写。最好不要写成这样：“200px solid black”,虽然不报错，但是代码不美观。

### 查询计算样式

要注意的是，以上的方法不能得到最终值，只能得到行间样式。就要用一下这个。

window.getComputedStyle(ele,null)。第一个参数填DOM元素，执行完之后返回一个类数组，里面的记载是元素的最后的展示值.比第一种方法更加精确，所以这个这个是最标准的获取方法。


但是这个方法只读。返回的计算样式是绝对值。背景颜色返回rgb形式。em（相对本元素的字体大小）也会转化为绝对值，IE8以及IE8以下不兼容。

IE8和IE8以下：dom.currentStyle ：也是返回CSSStyleDeclaration，但是不是获取绝对值，获取的也是最终值，但是不会转化。

现在封装一个方法，来兼容各种浏览器，用来查询元素样式。
	
	function getStyle(elem, style){
		if(window.getComputedStyle){
			return window.getComputedStyle(elem,null)[style];
		}else{
			return elem.currentStyle[style];
		}
	}

关于这个null的参数，是用来选取伪元素的样式，after和before，
	
	div{
		width:10em;
	}
	div::after{
		content:"";
		width:10px;
		height:10px;
		background-color:green;
		display: inline-block;
	}
	
	var div = document.getElementsByTagName('div')[0];
	window.getComputedStyle(div,"after")   //10px
	
但是我们只能查询，修改要利用修改class名就是修改类名来进行修改。

利用修改类名的方法是最标准的模块化开发修改，利用style去修改多用于动态的修改某个属性。

那么这个内容就分享到这，希望大家能有所收获。再见。。














