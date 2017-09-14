---
layout: post
title: 前端核心知识（18）———— JavaScript继承发展史，命名空间
date: 2017-07-26
tags: [JavaScript]
---

大家晚上好，今天继续给大家来分享前端核心知识JavaScript，先讲一下继承的发展史。

## 继承发展史

第一种继承形式:

                Grand.prototype.lastName = "abc";
                function Grand() {
                    this.age = 123;
                }
                var grand = new Grand();
                Foo.prototype = grand;
                function Foo() { }
                var foo = new Foo();
                Person.prototype = foo;
                function Person() { }

        
这种继承方式太麻烦了，而且还不美观，于是一开始就被pass掉了。

第二种继承方式：

        function Factory(name,age){ 
            this.name = name;
            this.age = age;
        }
        function Person(name,age){
            //var this = Object.create(Person.prototype);
            Factory.call(this,name,age);
            //return this;
        }
        var person = new Person('age',123);
        
这种方式本质上不叫继承，因为他是借用call和构造函数，把工厂函数的this指向改变为自己而已，而且访问不了原型的原型。

第三种继承方式：

                function inherit(origin,target){
                    target.prototype = origin.prototype;
                }
                Person.prototype.lastName = "Leung";
                function Person{ };
                function Son(){ }
                inherit(Person,Son);
        
这种方式就是利用共享原型来进行继承，但是这还是有个缺点就是，当我们给Son的原型上添加属性的时候，发现，Person的原型也会发生同样的变化，这就是我们不想要的，于是就产生了第四种方式了。


第四种继承方式：圣杯模式 

为了解决第三种方法产生的bug，我们需要添加一个中间层，产生一个过渡。

        function inherit(Origin,Target){
            function F() { };
            F.prototype = Origin.prototype;
            Target.prototype = new F();
        }
        Person.prototype.lastName = "Steven";
        function Person () { }
        function Son() { }
        inhert(Person, Son);

解释一下，第三种情况出现的bug，是因为son和Person原型指向是同一个房间，所以当房间的内容改变的时候他们就会同时发生改变，这时候我们加上一个中间层，F函数，里面就是让它的原型指向origin的原型，然后，Target的原型继承自F函数的原型，就相当于也继承了origin的原型，而且实现了son改变的时候，Person的原型不发生改变。

但是，这还是有一点不足，我们知道constructor属性指向的是构造这个对象的函数，但是这时候son的constructor指向的是Person，因为F函数里面没有constructor属性，于是便会随着原型链网上找，于是就找到了Person里面，这时候我们需要手动地给son添加一个constructor属性。

还有就是，在正常开发中，我们需要一个叫超类（Uber）的东西，用来查询这个函数究竟是继承自谁。于是，圣杯模式的最终形式就是这样的：

        function inherit(Origin,Target){
            function F() { };
            F.prototype = Origin.prototype;
            Target.prototype = new F();
            Target.prototype.constructor = Target;
            Target.prototype.uber = Origin.prototype;
        }

## 圣杯模式高级写法

我们利用雅虎的YUI库进行一个高级的圣杯模式写法，利用的是闭包的私有化变量。

	var inherit = (function () {
			var F = function () { };
			return function (origin,target) {
			F.prototype = Origin.prototype;
			Target.prototype = new F() ;
			Target.prototype.constructor = Target;
			Target.prototype.uber = Origin.prototype;
		}
	}())

利用的是闭包的私有化变量，可以看到，function 与F函数产生了一个闭包，只有function里面的方法才能访问到F函数，这种写法更高级。


## 命名规范（org）

在公司开发中，往往不是自己一个人把所有的业务都开发完成，而是与团队一起开发的，这样就很难避免会有变来那个名字一样的情况，这时候，就会产生变量冲突，我们可以利用对象来进行解决。

每一个对象就相当于一个部分，对象里面的东西都是独立的，不会互相干扰。
	
	org = {
		department1: {
		    steven : {
			age : 20,
			sex : "male"
		    }
		    xv : {
			age : 22,
			sex : "male"
			}
		}
	}
	var steven1 = org.department1.steven.age;
	var xv = org.department1.xv.age;
	
类似的，我们可以进行多个部门的组合，这样就可以避免变量冲突了。
		
以上的以上的方法是旧方法来解决的，现在多数使用闭包来进行解决，每个变量都在自己的域中，别人访问不了。

	var add = (function () {
		var count1 = 0;
		var count2 = 0;
		function myAdd(num1, num2){
			count1 = num1;
			count2 = num2;
			console.log(count1 + count2);
		}
		return function (num1,num2){
			nyAdd(num1,num2);
		};
	}())
	
这种解决方式，也是类似于利用私有化变量来解决命名冲突，只有在与自己产生闭包的变量才能访问到。


那么关于这部分知识，就先讲到这里，希望大家能有所收获。







