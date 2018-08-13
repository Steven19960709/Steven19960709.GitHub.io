---
layout: post
title: JavaScript对象枚举和arguments
date: 2017-07-28
tags: [JavaScript]
---

今天继续分享JavaScript的知识，今天我们要将一下对象的枚举。

## 对象的枚举

当我们想把对象的每一个属性都打印出来的时候，我们需要利用for in 循环。

	var obj = { 
	    name :  "abc",
	    age : 123,
	    sex : "male
	}
	for(var prop in obj){
	    console.log(obj[prop]);
	}
	
这个时候就能把对象中的每一个属性都打印出来。var prop 相当于声明一个变量，in obj，每次循环都会从obj中拿出来一个属性名，obj[prop]就可以得到每一个属性值。注意不能写obj.prop这个形式，因为系统会将它变成obj['prop']属性，所以每次都是undefined。

for in循环只针对处理对象，而且可以把var prop写在外面。

for in循环会有个问题：

	Person.prototype.name = "abc";
	function Person() {
	    this.age = 123;
	    this.sex = "female";
	}
	var person = new Person();
	for(var prop in person){
	    console.log(person[prop]);
	}
	
这个时候发现，它会把自己原型链的属性也会打印出来，这有时候就不是我们需要的，我们只需要它自己的属性，这样就有一下的另一个方法了。


2.hasOwnProperty

他会判断是否为自己的属性，过滤掉不是自己的属性。

	Person.prototype.name = "abc";
	function Person() {
	    this.age = 123;
	    this.sex = "female";
	}
	var person = new Person();
	for(var prop in person){
	    if(person.hasOwnProperty(prop)){
	        console.log(person[prop]);
	    }
	}

这样就可以打印出自己的属性。

3.in 操作符

判断某个属性是否存在于某个对象中，注意的是，要写成字符串的形式。

	var obj = {
	    name : "abc",
	    age : 21,
	}
	if("name" in obj){
	    console.log('yeah')
	}
	
但是这个有个缺点就是如果，原型链上线存在，它也是会返回true的，只要存在就是true，换句话说就是不能判断是否属于自己的属性。

4.instanceof 操作符

判断前面的对象是否为后面的构造函数所构造出来的。它是用来判断前面的函数的原型链上是否存在于后面的函数的原型。

	function Grand() { }
	Person.prototype = new Grand();
	function Person() { }
	var person = new Person();
	person instanceof Person // true
	[] instanceof Array  // true 
	Array instanceof Object // true
	Object instanceof Array // false
	

## 区分数组和对象

1.instanceof 操作符 

	Array instanceof Object // true  
	Object instanceof Array //false ;

2.利用constructor 

	var obj = {};
	var arr = [];
	arr.constructor // function Array() { [ native code] }
	obj.constructor // function Object() { [ native code] }
	
3.toString方法

为了方便各种类型进行打印，系统在每个原型链上面都重写了toString方法。因为对象，数组都不能直接使用document.write()进行打印，系统会内部进行调用该变量的toString方法。但是我们需要跳过数组自身的toString方法，去使用Object上面的toString。这时候，就要使用call来改变指向。
	
	var obj = { };
	var arr = [ ];
	var  toStr = Object.prototype.toString;
	console.log(toStr.call(obj));//[object Object]
	console.log(toStr.call(arr));//[object Array]
	
封装成方法
	
	function isArrayOrObject(target){
	    var toStr = Object.prototype.toString,
	        arrStr = '[object Array]';
	    if(toStr.call(target) === arrStr){
	        return 'this is Array';
	     }else{
	        return 'this is Object';
	     }
	}


## arguments

arguments是每个函数都具有的一个对象，实参列表。它有一个属性叫做callee，指向的是函数的本身。

用处：初始化一个非常复杂的东西。例如计算n的1000次方

	var num = (function(n) {
	    if(n == 1) {
	        return 1;
	    }
	    return n * arguments.callee(n-1);
	}

function.caller:指向的是那个函数调用的function。打印出执行当前函数被调用的函数。。。好绕啊。看例子吧。主要看的是callee和caller的区别。

	function test(){
	    demo();
	}
	function demo(){
	    console.log(demo.caller) //function test() {} 
	}
	test();

那么这部分内容就介绍到这里，希望大家能有所收获。
























