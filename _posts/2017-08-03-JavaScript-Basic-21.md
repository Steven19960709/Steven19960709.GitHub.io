---
layout: post
title: 前端核心知识（30）———— JavaScript 事件类型
date: 2017-08-03
tags: [JavaScript]
---

在将今天的内容的时候，我们先来写一个拖拽。

思路：鼠标每移动一次，记录一下数据，

		var div = document.getElementsByTagName('div')[0];
		var disX,
			disY;
		div.onmousedown = function (e) {
			disX = e.pageX - parseInt(div.style.left); //
			disY = e.pageY - parseInt(div.style.top);
			document.(div.)onmousemove = function (e) {
			// 绑定在div上面的话，只有在div身上移动的时候，才会触发事件，而检测事件是有系统监控的，如果刷新频率跟不上移动的速率，这个时候，就会造成，鼠标移动了，但是方块没移动，就是掉帧。所以要绑定在document上面。
							var event = e || window.event;
							div.style.left = e.pageX - disX + "px";  //以中心点为移动中心
							div.style.top = e.pageY - disY + "px";
						}
			div.onmouseup = function () {
				div.onmousemove = null;
			}
		}

事件捕获的另一种形式，老程序员会问。

div.setCapture()；捕获页面上的所有地方的事件，获取到div身上，获取完之后要释放，利用div.releaseCapture(),不然在其他地方都用不了事件。

## 事件分类

### 鼠标事件

mousedown：鼠标按下事件

mouseup：鼠标抬起事件

click: 鼠标点击事件。等于mousedown + mouseup 。先down后up再click。

mouseover/mouseenter：鼠标进入事件，

mouseout/mouseleave：鼠标离开时间

#### 利用button来区分左右键。

只能用mouseup和mousedown来区分。当我们触发mousedown的时候，事件对象会有一个属性叫做“button”，如果返回的是2，那么就是右键，如果是返回0，那么就是左键。中间滚动轮为1.

注意不能有click来监听，click只能监听左键。

练习：区分拖拽事件和点击事件，通过时间差。大于一定时间为拖拽，否则就是点击。

		var key = false; //开关，判断走哪个代码块
		var firstTime,
			lastTime;
		div.onclick = function (e){
			if(key){
				console.log('click');
			}
		}
		div.onmousedown =function (e){
			firstTime = new Date().getTime();
		}
		div.onmouseup = function (e){
			lastTime =new Date().getTime();
			if(lastTime - firstTime > 200){
				key = false;
			}else{
				key = true;
			}
		}
		div.onmousemove = function (e){
			console.log(e.pageX + "" + e.pageY)	

		}

	
### 键盘类事件 
	
keydown: 键盘按下事件

keyup：键盘抬起事件

keypress：键盘点击事件，要注意，这个是跟鼠标事件有区别的。触发顺序是先down然后触发press，抬起之后再触发up。如果一直不抬起，会一直触发down和press。

keydown事件对象有一个属性 witch，操作类按键。监听108个键。

keypress只能检测到字符类按键。利用charCode，按照阿斯克码排序，将阿斯克码转化为字符。可以分辨大小写。

string.fromCharCode(e.charCode) 就可以将阿斯克码转化为字符。

### 文本类操作事件 

	input.oninput = function (e) {
		console.log(this.value);
	}//检测文本框里面的信息，只要有变化就会触发事件，就会打印出来。
	
	input.change = function(e) {
		console.log(this.value);
	}//检测文本框里面，状态是否发生变化，变化了，失去焦点的时候就会触发，如果没有变化，失去焦点不会发生变化。
	
### 窗体类事件（window上的事件）

scroll ：当滚动条滚动，就会触发该事件，利用这个我们可以模拟一个position：fix，IE里面没有fix。利用这个模拟一个定位。
	
		function fixed (elem){
			var posX = parseInte(getStyle(elemm 'left'));
			var posY = parseInt(getStyle(elemm 'top'));
			window.onscroll = function() {
				var disX = getScrollOffset().x;
				var disY = getScrollOffset().y;
				console.log(disX + '' + disY);
				elem.style.left = parseInt(getStyle(elem,'left')) + disX + 'px';
				elem.style.top = parseInt(getStyle(elem,'top')) + disY + 'px';
			}
		}

window.onload事件：解析文档的时候，html和css是一起解析的，html会形成一个DOM树，css会形成一个css树，当两个树拼到一起会形成一个渲染树（renderTree）
，然后开始进行渲染。如果碰到img标签，会先挂到树上，不着急下载，在解析的时候，会多开一个线程，并行地下载img。当所有html标签都解析完之后，JavaScript就开始解析了。但是window.onload是等所有资源解析并下载万才能触发该事件。效率非常低。这个事件通常是用来提醒加载完毕。
	
OK，那么今天的内容就分享到这里，希望大家能有所收获，晚安！！
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
