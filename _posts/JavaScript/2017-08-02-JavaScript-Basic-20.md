---
layout: post
title:  JavaScript 事件冒泡，捕获（事件处理模型）和事件委托
date: 2017-08-02
tags: [JavaScript]
---

现在要讲一下关于JavaScript的事件冒泡和捕获的相关知识。

## 事件冒泡
		.wrapper{
			width:300px;
			height:300px;
			background: red;
		}
		.content{
			width:200px;
			height:200px;
			background: green;
		}
		.box{
			width:100px;
			height:100px;
			background:yellow;
		}

		<div class="wrapper">
			<div class="content">
				<div class="box"></div>
			<div>
		</div>	
		
		var wrapper = document.getElementsByTagName('div')[0];
		var content = document.getElementsByTagName('div')[1];
		var box = document.getElementsByTagName('div')[2];
		wrapper.addEventListener('click',function (console.log('wrapper') {},false);
		content.addEventListener('click',function (console.log('content') {},false);
		box .addEventListener('click',function (console.log('box') {},false);

这段代码，给每一个方块都绑定了一个点击事件，点击该方块，就会打印出对应的名字。

视觉效果是这样的：<img src="http://os310ujuc.bkt.clouddn.com/blog12.PNG">

特别的是，当我们点击box的时候会把三个事件都触发了，点击content的时候，会把content和wrapper都触发。这就叫事件冒泡。

事件冒泡：结构上的而非视觉上的嵌套关系的元素，会存在事件冒泡的功能，即同一事件，自子元素冒泡向父元素。（自底向上），如题，点击box子元素的时候，它会一级一级的冒向父元素，自地上向，最后冒向wrapper，结构上的，而非视觉上的。事件冒泡是存在于结构逻辑上的，并不是视觉逻辑上的。

## 事件捕获（只有谷歌有）

声明一下，一个对象的一个事件类型，只能存在一个事件模型。将冒泡转化为捕获很简单，只要把false参数转化为true即可。

事件捕获：结构上（非视觉上）嵌套关系的元素，会存在事件捕获的功能，即同一事件，自父元素捕获至子元素（事件源元素）。

对于上述例子，如果点击box，会先打印出wrapper，然后是content最后是box。

IE没有捕获事件，最新版本的Opera和火狐都有。

#### 注意同一个对象的同一个事件类型绑定了两个函数，让两个函数分别遵循事件捕获和事件冒泡，它们会先捕获然后先冒泡。

将以上代码复制一次，点击box。

捕获---》捕获---》事件执行---》冒泡---》冒泡---》事件执行。

另外有些事件 冒泡功能，如：focus，blur等。

## 取消冒泡和阻止默认事件

有些情况，冒泡并不是好事，这时候，我们需要阻止冒泡事件。

事件对象，在每个事件处理函数，可以填一个形参e，系统会自动往里面传一个东西，叫做事件对象。e 上面有很多属性，记录很多事件发生时关键性数据，如鼠标坐标，事件类型等。

事件对象上面有一个方法可以阻止冒泡事件。

	event.stopPropagetion()

但是不支持IE9以下版本。

2.IE能用的 ： e.cancelBubble = true;

现在我们来封装一个方法来兼容各种浏览器，用于阻止默认事件。

	function stopBubble(event){
		if(event.stopPropagetion){
			event.stopPropagetion();
		}else{
			event.cancelBubble = true;
		}
	}

## 阻止默认事件

默认事件，时浏览器默认在一定情况会自动触发的事件，例如鼠标右击产生菜单等。有些我们不需要，就可以阻止默认事件。

1.return false方式;只有句柄绑定事件的时候，才能有这用这个取消。attachEvent就不好使，就需要有以下的方法。

	document.contextmenu = function() {
		return false;
	}

2.event.preventDefault() ,W3C标准，IE9以下不兼容。 

	document.oncontextmenu = function (e) {
		e.preventDefault() ;
	}

3.兼容IE，event.returnValue = false;

	document.oncontextmenu = function (e) {
		e.returnValue = false;
	}

再来一个兼容性的方法，来取消默认事件。

	function cancelHandler(event) {
		if(event.preventDefault) {
			event.preventDefault();
		}else{
			event.returnValue = false;
		}
	}
	
a标签作为按钮的时候，要取消它的默认事件。

1.在行间写：<a href="javascript:void(false)//相当于写返回值 return false">

2.

		a.onclick = function () {
			return false;
		}

## 事件对象 （IE浏览器）

在IE中，事件对象会存在于window上面，需要兼容。这样写

	div.onclick = function (e) {
		e = window.event || e;
	}

事件源对象，事件对象上面有一个属性会记录事件源对象，用来记录究竟是谁触发这个事件的。

火狐：event.target；

IE：event.srcElement；

谷歌上两个都有。

## 事件委托 

背景：一个ul里面有一百万个li，点击每个li，输出对应的内容,后期还会继续添加。

利用事件源对象进行编程。ul的区域大小，是由li决定的，当我们点击第一个li，就会冒泡给ul。我们把事件绑在ul上面即可。

	var ul= document.getElementsByTagName('ul')[0];
	ul.onclick = function (e) {
		var event = e || window.event;
		var target = event.target || event.srcElement;
		console.log(target.innerText);
	}

优点：

1. 性能 不需要循环所有的元素一个个绑定事件。

2. 灵活 当有新的子元素时不需要重新绑定事件。

好吧，今天的内容就更新到这里，大家晚安！！


