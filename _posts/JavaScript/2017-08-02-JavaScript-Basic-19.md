---
layout: post
title:  前端核心知识（28）———— JavaScript 事件绑定和事件解除
date: 2017-08-02
tags: [JavaScript]
---

今天开始讲一个非常有意思的东西了，是JavaScript交互的核心————事件。

## 事件

事件是一个动作，给它一个信号，它会给我们一个反馈。这样的交互就叫做事件。例如：

		var div = document.getElementByTagName('div')[0];
			div.onclick = function() {
			console.log('a');
		}
		
这样每次点击一下div就会打印出一个a，要注意的是，就算没绑定事件，该元素还是天生就自带事件的，只是我们没看见而已。我们绑定的是一个处理函数，而已。

### 绑定事件

1.ele.onXXX = function () { }; 句柄绑定方式。

在某个元素的click事件上，绑定一个函数。这种绑定方法，兼容性非常好。基本等于写在html行间上，而且有个缺点，就是这种方式只能绑定一个函数。

	<div onclick="console.log('a');" //在行间不需要写function声明

2.ele.addEventListener(click , function ,false)；标准方式。能给同一个对象的同一个事件，绑定多个处理函数。

这种方式绑定是最标准的，函数参数位，填的是函数的引用，就是填函数名。监听事件不是JavaScript引擎进行操作的。

	div.addEventListener('click', function() {
		console.log('a');
	}, false);
	div.addEventListener('click', function() {
		console.log('a');
	}, false);
	
	//打印出两个a
	
	
	function test() {
		console.log('a');
	}
	div.addEventListener('click', test,false);
	div.addEventListener('click', test,false);
	//打印出一个a；
	

3.div.attachEvent('on'+ type, function() { }); IE9独有的。一个事件能够绑定同一个函数能执行多次。IE独有。

来个思考题，绑定一个处理事件，给ul下面的里绑定事件，点击那个li，打印出对应的下表。

来条分界线，晚上回来在更新，睡一会午觉，哈哈哈。
------------------------------------------------------------

来，继续更新。按照惯性思维：

	var liCol = document.getElememntsByTagName('li'),
	    len = liCol.length;
	for(var i = 0; i < len; i++){
		console.log(i)
	}

这个会发现，最后打印的都是4.因为产生了闭包，这个时候，老规矩，我们需要利用立即执行函数进行修改。
	
	var liCol = document.getElememntsByTagName('li'),
	    len = liCol.length;
	for(var i = 0; i < len; i++){
		(function (i) {
			liCol[i].addEventListener('click',function () {
				console.log(i);
			},false);
	
		}(i))
	}

在我们在绑定事件的时候，如果利用for循环，就要考虑是否产生闭包，当然，如果没有用到for循环里面的变量，就没事，如果用到了for循环里面的东西就会产生闭包。要使用立即执行函数。


## 事件处理程序的执行环境

这个东西指的是事件中的this。


		var div = document.getElementByTagName('div')[0];
		div.onclick = function (){
			console.log(this)
		} //指的是div本身
		
		div.addEventListener('onclick;,function () {
			console.log(this) ; //也是指的div本身
		});

特例：
	
	div.attachEvent('onclick',function () {
		console.log(this);  //指向的是window，是一个bug
	});

这个时候，我们需要将this指向div本身。我们需要做以下变动：

	div.attachEvent('onclick',function () {
		handle.call(div) //间接地，将函数放到外部，通过call改变指向
	});
	function handle() {
		//code
	}

现在就要封装一个兼容性方法，来兼容不同的浏览器：给一个DOM对象绑定事件。参数：DOM对象，事件类型，处理函数；

	function addEvent(elem, type, handle){
		if(elem.addEventListener){
			elem.addEventListener(type, handle, false);
		}else if(elem.attachEvent) {
			elem.attachEvent('on' + type, function () {
				handle.call(elem);
			})
		}else{
			elem['on' + type] = handle;
		}
	}


## 解除事件处理程序 

有时候有需要把已经绑定的事件进行解除。这时候就需要把它解绑。例如，一个网页之能触发一个广告，再触发就不会弹出。

1.XXX.onclick = null; 这种方法是最简单的，但是很low。

2.XXX.removeEventListener('对应的事件类型',‘对应的函数引用',false);注意的是必须是非匿名的才能添上函数的引用。 意思就是，如果绑定匿名函数则无法解除。

那么关于事件的这部分内容就先讲到这里。希望大家能有所收获。




