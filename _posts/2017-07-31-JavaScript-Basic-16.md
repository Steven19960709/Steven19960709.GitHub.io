---
layout: post
title: 前端核心知识（25）————JavaScript 日期对象
date: 2017-07-31
tags: [JavaScript]
---

在讲今天的内容之前，我们先利用昨天的知识，写一个方法。

## 封装一个函数insertAfter(),功能类似于insertBefore()

昨天说过关于insertBefore(a,b)的方法，父级调用，在a之前插入b.那么对于这个insertAfter(a,b)方法也是类似的，也是有父级调用，在a后面插入b。了解了功能之后，我们就要开始实现了。由于手头上方法，也就那么一个 insertBefore()，利用它我们可以进行插入的操作。但是，在插入之前，我们需要找到插入节点的位置，那么我们怎样才能找到需要进行插入操作得节点呢？请看以下分析：

	<div>
		<span></span>
		<em></em>
		<a></a>
	</div>

如果我们需要在em标签后面插入节点，就相当于在a标签之前插入节点，他们两个是等价的，所以，我们就可以利用这个思维，先找到想插入的节点a的下一个兄弟节点b，然后对b节点调用insertBefore方法，在b之前插入目的节点，那么就相当于在a之后插入了一个目标节点了。

明白了这个问题之后，我们还需要判断他是否有兄弟节点，如果存在，就调用insertBefore，如果没有就进行appendChild即可。代码如下：

	Element.prototype.insertAfter = function (target,afterNode){
		if(siblingNode){ 
			this.insertBefore(target, siblingNode);
		}else{
			this.appendChild(target);
		}
	}

这个就是整个完整的代码。

## Date 日期对象

Date对象用于处理日期和时间的一类对象。

### 静态类 

JavaScript慢慢发展向面向对象，朝向Java方向，原型，继承等都是面向对象的，慢慢就摒弃面向过程编程。当我们想使用某些方法的时候，通常可以使用new进行构造出来，或者直接使用 原型链上的方法，这种形式的就叫动态的方法。例如：

	function Person(){
		this.aaa = function() { };
	}
	var demo = new Person();
	demo.aaa();//调用方法
	
这种就叫做动态类。

后来有些方法不需要这么麻烦的方法，每次都去生成一个对象。有些很简单的就不需要这样操作。例如Math方法：Math.random,Math.sqrt。这样的方法其实是直接挂在一个对象上面可以直接调用。

	Math = {
		random: function() { },
		sqrt: function() { ],
		.........
	}
	


----------------------------------------------------

今天先更新到这里吧，今天去玩了，明天再更新吧，晚安！！

---------------------------------------------------

现在继续更新昨天的内容。


## Date

Date对象用于处理日期和时间，系统已经定义完了。我们直接通过new 构造出来一个对象，然后调用即可。但是展示出来的形式具有自己的方式。Date可以设定很多关于时间的东西，倒计时，时间点等。 

	var date = new Date(); //这样就构造出来一个对象了。静态的，记录的都是它生产出来的时刻。
	
### Date对象方法

Date(): 自执行，返回一个当前时间和时区。

	Date()     //"Tue Aus 02 2017 14:13:36 GMT+0800(CST)"  是一个字符串。
	
date.getDate() :返回当前日期。

date.getDay() : 返回当前星期天数。注意顺序为：0（周天） 1 2 3 4 5 6（周六）

date.getMonth() : 返回（当前月数-1）。
	 
date.getYear() : 返回从（当前年份-1900）。

date.getFullYear() : 返回当前年份。

date.getTime() : 返回从现在时间到1970年1月1日0时0刻的时间，毫秒数。1970 计算机纪元时间。这个方法很常用，通常是两个getTime联合使用，求时间差。

	var firstTime = new Date().getTime;
	for(i = 0; i < 100000000; i++){
	}
	var lastTime = new Date().getTime;
	
	console.log(lastTime - firstTime)

这个可以求出来程序的执行时间。

第二个作用就是作为时间戳：每一次发的请求都是不一样的，利用它可以做唯一表识。

Date,parse() : 注意它是用Date作为调用对象，参数是必须的，将参数转化为毫秒数。
	
	Date.parse(Date());
	
date.setDate() : 设置Date对象的某一天，然后可以在那一天执行某些程序，类似于闹钟功能。
	
date.setMonth() : 这只Date对象中的月份（0~11）;

date.setFullYear() : 设置Date对象中的年份（四位数字）。
	
date.setHours() : 设置Date对象中的小时（0~23）;

date.setSeconds() : 设定Date对象的秒数。

	var date = new Date();
	date.setSeconds(date.getSeconds() +20);  //设定时间 
	setInterval(function () {
		if(Math.abs(new Date().getTime() - date.getTime()) < 500 ){
		console.log('it's time')
		}
	},500);
	
这个程序到了规定时间将会打印出 it's time ，一个小应用。

## Js定时器

（浏览器会每隔16毫秒刷新页面一次）

setInterval定时器：setInterval(function () { }, 500)是window上面的方法，第一个参数与填的是函数的引用，第二个是填执行时间的间隔。

但是这个计时器不准，存在小误差，setInterval()的执行也是采用任务时间片的类似模式，每隔一段时间间隔，往引擎里面仍任务片段，理论上可能会慢，但是实际上。它可能会时而快时而慢。这个是个内核缺陷。

clearInterval() : 清除定时器，每个定时器都会有一个唯一表示，我们需要把唯一标示（数字）作为参数穿进去，然后就可以把定时器清除掉。
	
	var timer = setInterval(...)
	clearInterval(timer);
	
setTimeout(）： 只执行一次的计时器，例如，广告的多少秒执行一次。

clearTimeout() : 清除setTimeout计时器。

计时器全部都是window上的方法，内部函数的this全部执行this。而且，计时器里面的第一个参数可以直接填函数代码。第二参数时间间隔是一次性索取的，不能后期改变。而且setInterval是非常耗性能的。计时器的计时功能不是有JavaScript引擎来进行的计时的，它是由多线程的其他引擎进行的。

## 写一个计时器，到三分钟停止。
	
	minute: <input type="text" value="0">
	second: <input type="text" value="1">
	
	var minuteNode = document.getElementByTagName('input')[0];
	var secondNode = document.getElementsByTagName('input')[1];
	var minute = 0;
	var second = 0;
	var timer = 0;
	timer = setInterval(function() {
		second ++;
		if(second == 60) {
			minute +=;
			secnod = 0;
		}
		minuteNode.value = minute;
		secondNode.setAttribute('value',second);
		if(minrte == 3){
			clearInterval(timer);
		}
	},1000;
	

好，这部分就先讲到这，希望大家有所收获。
















	
	
	
