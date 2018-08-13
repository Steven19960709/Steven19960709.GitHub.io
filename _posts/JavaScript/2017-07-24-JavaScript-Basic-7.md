---
layout: post
title: JavaScript对象，构造函数原理和包装类
date: 2017-07-24
tags: [JavaScript]
---

昨天刚刚回到家，累的一x，今天就继续更新博客，今天要给大家讲一讲，JavaScript的构造函数原理和包装类的相关知识。

## 对象

在讲包装类的时候，我们先来讲一下对象。

对象是一个引用值，它可以有方法，属性，属性和方法之间要用逗号隔开，不能用分号隔开，否则会报错。定义对象的方法有以下几种：

1.对象字面量格式。

                var obj = {
                    first : "one",
                    last : "two",
                    func : function () { }
                }

2.构造函数生产对象。

系统给我们留了一个接口，可以用来生产对象：

                var obj = new Object()

之后，我们可以通过手动的方式往里面添加属性和方法：

                obj.name = "name";
                obj.func = function (){ }
        
这个方法如果要手动添加属性和方法的话，非常麻烦，效率低，这时候，我们还有第三种方法，就是自定的构造函数。

3.自定义构造函数。

自定义的构造函数方法可以自己定义方法，用于批量生产对象，类似于工厂中生产汽车：

                function Car(color) {
                    this.name = 'Maserati';
                    this.height = 1400;
                    this.widht = 1950;
                    this.color = color;
                    }
                var car = new Car("red");
                var car1 = new Car("green");

这两个函数都是通过构造函数Car来产生的，car和car1都是相互独立的，然后，他们可以通过传参来进行个性化的定制，例如，car1就是绿色，而car就是红色。

## 构造函数的内部原理

1. 在函数最前面隐式的加上this = { };（this为一个空对象）

2.执行this.xxx = xxx；

3.隐式地返回this对象。

举个例子：

        function Person(name,age,sex){
            this.name = name;
            this.age = age;
            this.sex = sex;
            }
                var person = new Person("Steven","20","male");
        
在函数person函数定义的时候，首先，会隐式地在执行上下文中添加一个空对象名为this，然后，执行每句语句，相当于往this里面添加对象的属性和方法。最后，所有语句读执行完毕的时候，隐式地把this对象返回出去。

要注意的是，构造函数要使用大驼峰式的写法，然后，如果构造函数没有使用new 来进行引用的时候，那么，this就是指向的window，例如，

        person1 = Person();

如果person = Person()，那么，这里的name指向的就是window，所有的带this的属性指向的都是window。当我们查询person.name的时候返回的是undefined，其他的属性的都是undefined，当我们查询，window.age 就是20。可以看出，没有利用new 来进行引用的构造函数，那么里面的this指向的就是window。

## 利用构造内部的内部原理进行模仿

当我们知道了构造函数的内部原理的时候，我们就可以模仿进行定义一个“构造函数”。

        function func(name,age){
            var that = {};
            that.name = name;
            that.age = age;
            return that;
        }

首先我们手动的创建一个空对象命名为that，然后给that对象定义方法和属性，最后显式地return that对象，但是这个人工的构造函数，效率等各方面都没有原生的好，而且还涉及到原型的问题的时候，也是有漏洞的，我将会在后面的博客中进行讨论。

## 构造函数的拓展

我们现在都知道，构造函数会隐式的返回this对象，现在我们不返回this对象，我们手动地将return设定为其他值：
        
        return 1234;
        return "Object";
        return true;
        return {};
        
我们可以发现，前三个都是原来由构造函数生产出来的对象，但是对于第四个，就变成一个空对象了，意思就是，如果我们return的如果是原始值，那么对结构没影响，但是如果返回的是一个引用值，那么结果就是return出来的那个引用值。


## 闭包作用的第四点 私有化变量

鉴于之前讲闭包的作用的时候，没有讲到构造函数，那么今天来不会一个闭包的作用，就是私有化变量。来看一下代码：

        function Deng(){
            var prepareWife = "xiaozhang";
            var obj = {
                name : "Laodeng",
                age : 40,
                sex : "male",
                wife : "xiaoliu",
                divorce : function () {
                    this.wife = delete this.wife;
                },
                getMarried :function () {
                    this.wife = prepareWife;
                },
                changePrepare : function (someone) {
                preparewife = someone;
                    },
                sayMywife : function (){
                    console.log(this.wife);
                }
                return obj;
            }
        deng = Deng();
        

我们可以通过操作一下看看什么情况，有什么关于闭包的点。

                deng.sayMyWife()         //"xiaoliu"
                deng.divouce()           //undefined (没有返回值）
                deng.sayWife()           //已经删除
                deng.changePrepare('xiaoxiaozhang')   //undefined (函数没有返回值）
                deng.getMarried()        //undefined
                deng.sayMyWife()         //"xiaoxiaozhang"
                deng.prepareWife         //undefined
        
大家在这段代码应该没怎么看出来，现在给大家讲解一下，为什么称之为私有变量。

首先，我们手动地查询prepareWife的时候，发现是undefined，因为这个是函数里面的变量，不在全局作用域里，所以我们访问不了，但是，一系列的操作都是围绕prepareWife来进行的，它们都可以正常访问这个变量，所以，像这种只能通过与这个变量产生闭包的方法，属性，才能给对那个变量进行访问，所以，我们就称之为，私有化变量，我们可以通过定制接口（各种方法），来对变量的安全程度进行设置。

## 包装类

首先我们要清楚一点就是，原始值是没有属性和方法的！！那么如果说，你硬要给原始值加上属性和方法，那么系统就会把它转化为原始值对应的对象的形式，称之为包装，那么该原始值的对象形式称之为包装类。

我们可以手动的把原始值变成对象形式：

                Number ——— new Number() ————数字的对象形式
                String ———— new String() ———— 字符串的对象形式
                Boolean ———— new Boolean () ———— 布尔值的对象形式


说完这个之后，我们说一说当我们把一个原始值添加属性的时候，会发生什么事情。

首先，JavaScript引擎会隐式地将原始值转化为对应的对象类型，然后，进行delete操作，意思就是，当我们给一个原始值添加属性的时候，引擎将会马上删除该原始值的对象形式。例如：

                        var num = 123;
                        num.abc = "a";
                        //new Number(num).abc = "a"; ---->delete;
                        console.log("new.bac")      //undefined

我们知道数组有一个属性length，它可以查看数组的长度，那么字符串也是有长度的，但是它不能像数组那样使用length对字符串进行截断处理，就是因为当对string进行设置length之后，之后会把马上销毁掉不进行任何地保留或者处理。

之后我们来看几个例子进行巩固一下。

		例一：运行test()和new test()的结果分别是什么？

		 var a = 5;
		 function test(){
			 a = 0;
			 alert(a);
			 alert(this.a);
			 var a ;
			 alert(a);
		 }

test:  第一个打印结果是 0 ，这时候的a指的是函数里面的a，第二个打印的是5，因为没有使用new操作符进行定义，this这个指向的是window里面的a，最后一个a指的是函数里面的a所以是0；

new test: 首先利用了new构造函数，this指向的是函数自己，所以第一个还是0，第二个就是undefined，因为没有this.a，第三个就是0。

	例二：最后打印结果是什么？
	var str = "abc";
	str += 1 ;
	var test = typeof(str);
	if(test.length == 6){
		test.sign = "typeof的返回结果可能是String";
	}
	doucment.write(test.sign);

如果，从上直接看下来，最后大家可能都认为能够打印出来"typeof的返回结果可能是String"，但是，大家可能忘了，包装类，当定义完之后，就会被马上销毁，所以最后打印结果是undefined。

好了，今天的更新就到这里，大家晚安！！！

                







