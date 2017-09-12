---
layout: post
title:  前端核心知识（17）————JavaScript原型和call、apply的用法
date: 2017-07-25
tags: [JavaScript]
---

今天继续给分享前端的核心知识，今天要讲一下原型和call和apply的用法。

## 原型

首先说一下原型的概念：原型prototype是function对象的对象的一个属性，它定义了构造函数制造出来的共有祖先，通过该构造函数产生的对象，可以继承该原型的属性和方法，要注意的是，原型也是对象，这意味着，可以对它进行增删改查.下面开始解释一下对应的意思。请看一下代码：

                                Person.prototype.name = "Steven";
                                Person.prototype.age = 20;
                                Person.Prototype.sex = "male";
                                function Person() { }
                                var person1 = new Person();

                                person1.name    //"Steven"
                                person1.age     // 20
                                person1.sex     //male
                                person1         //Person>>>__proto__:Object(原型)


通过构造函数Person制造出来的函数person1，                                                                  

--------------------------------------------------
好气啊，刚刚家里的台式机屏幕闪了一下，以为是电源接触不良，把电源拔了，顿时发现，台式机断电就关机，用惯了笔记本，，，没习惯过来，，，得重写了，来条分界线。。。。。。。。。。
--------------------------------------------------

我们可以看到了，虽然person1表面上什么都没有，但是因为它是有Person构造出来的，所以他继承了Person的原型，所以就有其他的看不见的属性想name，age，sex。

但是我们要注意的是，person1上面的属性是只读的，不能修改它原型上的属性，也不能够删除，就算是修改，也是简单滴在自身的对象上面添加上对应的属性，并不能够修改原型上的属性。例如：

                                person1.name = "LeungGabou";
                                delete person1.name 
                                person1.name     // "Steven"
                                delete person1.name 
                                person1.name     //"Steven"
        
        
另外对于引用值 ，例如数组，我们是可以利用数组自身的一些方法进行修改，例如：

                                Person1.prototype.card = [100,100,100];
                                function Person1() { }
                                person = new Person1() { }
                                person.card.push(100);
                                person.card      // [100,100,100,100]

   
   
## 原型的使用场景

我们都知道，我们可以利用构造函数进行初始化，例如汽车工厂加工：

                function Car(color){
                    this.height = 1400;
                    this.width =1900;
                    this.color = color;
                }
                var car1 = new Car('green");
                var car2 = new Car("red");


可以看到，两个car1和car2只是color不一样，但是，第一第二条都是重复执行的，换句话说就是耦合的，这时候我们就需要对其进行解耦，这时候，原型就派上用场了。

                Car.prototype.height = 1400;
                Car.prototype.width = 1900;
                function Car(color){
                    this.color = color;
                }
                var car1 = new Car("green");
                var car2 = new Car("red");


这就是原型的基本的用途就是提取公有属性，共有的，重复的，能够提取出来的，放在原型上面，而私有的个性化的属性，就可以放在函数里面，每次执行就只执行个性化的。

最后，总结一下就是，原型就是一个对象，每一个函数有一个原型，而且每一个函数都只有一个原型。

### 原型的另一种写法

                Car.prototype.height = 1400;
                Car.prototype.width = 1900;
                Car.prototype.name = "Masarity";
                Car.prototype.logo = "xxx";

这个写法很多重复，而且也不美观，这是胡，我们就可以自定义一个对象，进行添加属性和方法。

                Car.prototype = {
                    height : 1400,
                    width : 1900,
                    name : "Masarity",
                    logo : "xxx"
                }


这就是一个原型，就是我们自己定义的对象，但是要注意的是，这个我们自己定义的原型，跟原来的系统提供的原型是不一样的，但是还是可以正常使用。不过会有一个明显的区别。接下来给大家继续讲讲。

## 原型的继承关系和过程

构造函数创建对象的时候，里面有一个__proto__的属性，它指向的是该函数的原型，当访问变量的时候，如果自身没有该属性，它就会寻找__proto__上面指向的该函数的原型上去寻找，如果这个原型上面也没有，会继续沿着原型上面的proto属性继续寻找，这条链式结构，就称之为原型链，每条圆形脸的终点就是Object。如果，在原型链终点上面也没有找到查询的变量就会报undefined。

### constructor 构造器

构造函数创建对象的时候，会有一个constructor属性，指向的是构造出该对象的函数。
当我们自定义的方法设定原型的时候，constructor属性是没有的这时候就是与原生原型的区别，这时候我们还需要手动添加constructor属性，这样就完美了。

                没有设定constructor属性的时候：
                car1.constructor        // function Object() { [native code] }

                设定了constructor属性的时候：constructor 就是指向Car
                Car.prototype = {
                height : 1400,
                width : 4950,
                constructor : Car
                }
                function (color) {
                this.color = color;
                }

### 创建对象的第四重方法 Object.create()

在没有讲到原型的时候，我们没有介绍这种方式来进行对象的创建，现在来介绍一下。

        Object.create(prototype)

这种方法创建对象，传进去的必须是原型，然后不能是原始值，否则会报错。

特殊情况，如果填null，是不会报错，但是里面的东西就没有原形了，其他增删改查都是正常进行。

如果没有原型，有一些问题就会出现。例如，当我们使用document.write的时候，对象是不能直接打印出来的，只能隐式地调用toString方法，然后再进行操作，如果没有原型，那么就没有toString方法，那么使用document.write的时候就会报错。

另外，只有使用Object.create的时候才能把null传进去，其他情况手动的将prototype设定为null都是不好使的。

面试题：所有对象的终端指向object.prototype是错误的，绝大多数才是对的，因为null没有原型。






## call和apply

call和apply致力于当构造函数创建对象的时候，改变this的指向。例如：

               function Person() {
                   this.name = "abc";
                   this.age = 123'
               }
              var obj = { }；
              Person.call(obj);
              obj      // Object { name : "abc",age :123 }

可以看到，obj原来是空的，但是当call指向obj的时候，Person中的this指向就变成了obj了，所以最后就是往obj中添加对象的属性。

如果有参数，那么第一个参数就是指向，第二个参数就是传的函数参数。

            Person.call(obj,参数1，参数2)

apply和call的区别就是传参形式不同。

            Person.apply(obj,[参数一，参数二])

在实际开发中，更多的是使用apply，因为我们可以利用arguments来进行不定参操作。

            function Person(name,age){
               this.name = name ;
               this.age = age;
            }
            var obj = { }；
            function test() {
                Person.apply(obj,arguments)
            }
            test('abc',123)

另外再多人开发中，当我们需要使用之前已经写好的一个十分复杂的代码块的时候，复制代码十分麻烦，因为通常变量都是涉及到上下文中的各个变量。我们不需要重新写一遍，直接使用apply，讲this指向改变就可以了。就是利用其他的方法来构建自己的方法，最后进行个性化的定制即可。

好吧，今天就想讲到这里吧，晚安！！













