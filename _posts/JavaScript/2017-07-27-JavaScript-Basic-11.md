---
layout: post
title:  JavaScript类数组和特殊语句
date: 2017-07-27
tags: [JavaScript]
---

今天要介绍一下类数组和一些JavaScript的特殊语句。

## 类数组

类数组本质上是一个对象，只是经过一系列的操作，将它表现的像数组而已，更准确的是叫做对象数组。最典型的一个类数组就是：arguments，实参列表。它不具备数组的一些方法。例如：

	function test(){
		arguments.push(1);
	}
	test(1,2,3,4,5,6)
	//报错：arguments.push is not a function ;
	
它只是长得像数组，它的原型指向的是Object。而数组原型指向的是Array。

手动的创建一个类数组：
	
	var obj = {
		"0" : "a",
		"1" : "b",
		"2" : "c",
		"length" : 4，
		"push" : Array.prototype.push	
		"splice" : Array.prototype.push	
	}

当加上length的时候，形式上就会变成数组,但是这时候，数组的方法还不能够使用,当我们手动添加一个数组方法，他就具有数组的特性，这种东西就叫类数组，可以当做数组来操作。然后，当我们加上splice这个属性的时候，它就会形式上也会变成数组的展现形式了。但是实际上也还是对象。

一个类数组能够投入使用，核心是length，因为，系统会以length为准，往里面操作数组。我们来试一下：

	
	var obj = {
		"0" : "a",
		"1" : "b",
		"2" : "c",
		"length" : 2,  //长度改为2
		"push" : Array.prototype.push	
		"splice" : Array.prototype.push	
	}
	obj.push(e);

如图：<img src="https://ojlty2hua.qnssl.com/image-1501168174768-YmxvZzYuUE5H.PNG?imageView2/1/w/200/h/200/q/75|imageslim">

这个时候就不像第一个情况那么准，这个时候，索引2的位置由c变成e，就是因为length为2，当往里面push的时候，系统就找到了索引为的位置，然后往里面push一个“e”，所以length是系统操作类数组的核心要点。来个例子：

	var obj = { 
		0 ："a",
		1 : "b",
		2 : "c",
		length : 1
		push : Array.prototype.push
	}
	obj.push("d")
	obj.push("e")
	console.log(obj) // Object {0 : "a", 1 : "d" , 2 : "e" ,length :3 }
	
如果说中间有索引是空缺，那么就是undefined，按照数组的形式来表现。

类数组的好处就是既能当数组用，又能当对象用，操作范围非常广。

补充一下，将类数组转化为数组，可以添加一个方法slice();
	var obj = { 
		0 ："a",
		1 : "b",
		2 : "c",
		length : 1,
		push : Array.prototype.push,
		slice : Array.prototype.slice
	}
	obj.slice()  // 转化为数组。


## try...catch 

当遇到逻辑性错误，就会阻塞后面的所有程序，有时候我们需要即使报错，也能继续往下执行，不发生阻塞，这时候，我们就需要利用try catch了。

	try{
		console.log(123);
		console.log(a);//不报错 跳到catch。如果没错，就直接跳过catch
		console.log(234);
	}catch(e){//捉住报错信息。
		console.log('a')
	}

try  catch低级错误例如：语法错误，不能捉住。当报错的时候，系统会把错误信息作为一个实参，传到catch里面，这个实参有两个属性，分别是name,和message，错误的名称，和错误的信息。

但是实际开发中，可见性的错误都要利用兼容解决。

## 错误类型

Error.name的六种值对应的信息：
	
	1.EvalError：eval() 的使用与定义不一致
	
	2.RangeError: 数值越界
	
	3.ReferenceError：非法或不能识别的引用数值
	
	4.SyntaxError：发生语法解析错误
	
	5.TypeError: 操作数类型错误
	
	6.URLError：URL处理函数使用不当

## ES5 严格模式 

ES5是ES3的升级版，现在快到ES8了。。。现在讲的东西都是ES3的，每次升级，都是在原有的基础上进行功能的增删改，所以有时候会产生兼容性的问题，产生冲突。当产生冲突时，默认的是优先使用ES3的。

但是我们需要使用ES5的功能时，我们需要使用严格模式。在逻辑的最前写"use strict",就会进入ES5严格模式。这个时候，callee就不能使用了，当然还有其他方法可能也不好使。

严格模式都可以在局部进行使用，在函数的逻辑顶端启用也是可以的：

	function exp(){
		"use strict";
		//code
	}

尽量将伤害降到最低。

为什么要使用"use strict"的形式呢？因为这种写法兼容性是最好的，在ES3引擎也能解析。

### ES5 严格模式下不能用的东西

1.with语句.可以改变作用域链。直接看到最顶端，提供一个执行上下文。很浪费效率，很浪费性能。如果指向的顶层作用域，没有需要的变量，又会在自己的作用域进行查找。当然，with可以与命名空间进行联合使用，也是有一定好处，这就不展开了。
	
	var obj = {
		a : "ooo"
		
	}
	var a = "global";
	function test(){
		var a = "test";
		with(obj){
			console.log(a);//ooo 这个时候，with直接到了obj中取索要a变量。
		}
	}
	test();

2.不能使用未声明的变量，例如：

	a = 13;
	console.log(a)  //a is not defined

this也必须要说明是什么指向。

3.拒绝重复的参数,属性。


那么今天的内容就分享到这里，大家晚安！！




































