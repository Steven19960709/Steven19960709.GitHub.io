---
layout: post
title: 前端核心知识（19）———— JavaScript this指向深谈
date: 2017-07-27
tags: [JavaScript]
---

今天要讲一讲关于JavaScript中的this指向问题，这是一个在后期开发中非常重要的知识点，可以解决很多bug。事不宜迟，马上开奖。。。

## 关于链式调用

有时候，我们需要像jQuery那样调用完一个方法之后连续的调用下一个方法，这时候，我们需要使用this了。

	var deng = {
		smoke : function () { 
			console.log("smoke,cool!!");
			return this;
		},
		firehair : function () {
			console.log('fire');
			return this;
		},
		drink : function () { 
			console.log("drink");
			return this;
		}
	}
	deng.smoke().firehair().drink();

这样写我们就可以实现链式调用了，因为当函数一调用执行完就会返回自己，如果没有返回this，那么以上代码就会报错。

## this指向

有了以上的this知识的铺垫，我们就可以开始讲this的指向问题了。

1.函数预编译过程，this指向的是window；例如：

	function test() {
		console.log(this);
	}
	new test() ;
	// AO { argument :[ ] ,
	//	this : Object.create(test.prototype);指向的是window
	//	}

实质上，当构造函数定义的时候，会正常走预编译的环节这时候，this指向的是window。

2.在全局作用域里的this，指向的是window；

3.call和apply，改变this指向，指向的是括号里面所传的对象；

4.obj.func()； func() 里面的this指向的是obj，意思就是，谁调用的方法就是指向谁。

## 典型例子

我们现在就要做些例子来进行巩固一下。

例一:
	
	var obj = {
		age : 123;
		smoke : function () {
			console.log(this);
		}
	}
	var smoke1 = obj.smoke;
	smoke1();
	//smoke1 = function () { connsole.log(this) };
	
在这个例子当中，相当于把函数体给smoke1，跟obj调用smoke的指向是不一样的，这就是简单的把函数体给smoke1而已，这时候smoke1执行的时候，就相当于自己执行，没有人调用它，所以这时候，正常走预编译环节，指向的是window。

例二：
	
	var name = "222";
	var a = {
		name : "111",
		say : function () {
			console.log(this.name);
		}
	}
	var fun = a.say;
	fun();  // 1 ： 222
	a.say();  // 2 ： 111
	var b = {
		name : "333";
		say : function (fun) {
			fun();
		}
	}
	b.say(a.say); // 3 ： 222
	b.say = a.say; 
	b.say(); //4 ： 333

我们一个个来分析,第一个函数执行的时候，是它自己执行，没有人调用它，所以这时候，指向的是window，打印的是222. 第二个函数执行的时候，是a.say() 意思就是a调用了say，所以this指向的是a，所以打印出来的是111. 第三个函数执行的时候把a.say的函数体拿出来，然后自己执行，类似于
例一这种情况。第四个函数执行的时候，把a.say给了b.say就相当于把函数体给了b里面的say方法。然后就b调用say方法，所以这时候this指向的是b，所以打印出的是333。

那么关于this的知识就讲到这，开发中的大多数情况也是达这种程度了，大家掌握了即可。

##  属性的表示方法

我们通常会使用这样的方法来表示属性的引用：obj.prop,但是有些情况这样调用方法是不好使的，例如：
	
	function getProp (prop){
		var obj = {
			age : 123,
			sex : "male",
			height : 175
		}
		console.log(obj.prop);
	}

这种方式调用属性的时候，会报错，当我们要通过变量传参的形式来调用属性的时候，我们需要用另外一种更好的方式

	console.log(obj[prop])

通过这种方式来调用属性，是系统内部最后的转化形式，因为，就算我们使用点的形式来进行属性的调用，系统内部最后还是会将它转化为中括号的形式。另外就是，通过中括号的形式调用属性，还能进行属性的拼接：

	function getProp (num){
		var obj = {
			friend1 : "a",
			friend2 : "b",
			friend3 : "c"
		}
		console.log(obj["friend" + num]);
	}

这样就可以进行属性的拼接了。

那么关于这部分的内容就分享到这。希望大家能有所收获。下回再见………











