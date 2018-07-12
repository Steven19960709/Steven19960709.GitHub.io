---
layout: post
title: JS与面向对象
date: 2018-07-11
tags: [CS]
---

## 基本概念

面向对象是一种思想，而不是代码的组织形式。英文为Object Oriented。它有三个基本特点：封装，继承，多态。

1.封装

以生产车来做例子，它包含了长，宽，高。这是车的基本特征。那么我们可以抽象为一下代码。

    class Car{
        constructor(width, length, height) {
            this.width = width;
            this.length = length;
            this.height = height;
            this.performance = 100;
        }
        run() {
            this.performance --;
        }
    }

这样就封装了一个Car类了。

2.继承

那么，车也有很多种不同的种类，例如品牌为玛莎拉蒂的，法拉利这类的，但是它们都是车，所以肯定会有车的属性，这就是继承，但是它们又有自己的特性。

    class Maserati extends Car{
        constructor(width, length, height) {
            super(width, length, height);// 继承Car的类
            this.production = "Maserati";
        }
    }
    let myCar = new Maserati(1100, 1200, 115); // 构造出一个玛莎拉蒂类

3.多态

同样的，玛莎拉蒂跑车，在跑的时候会损耗跟多机油，那么同样是车，家用车就不会耗这么多油，这就是多态。

    class Maserati extend Car{
        constructor(width, length, height) {
            super(width, length, height);// 继承Car的类
            this.production = "Maserati";
        }
        run() {
            this.performance -= 2; // 耗更多油
        }
    }

这就是基本的面向对象实例。

## 面向对象的设计模式

1.单例模式

利用一个数组来存放任务，按照先进先出的顺序执行。    

    class Task{
        constructor() {
            this.tasks = [];
        }
        // 初始化
        draw() {
            var that = this;
            window.requestAnimationFrame(function () {
                if (that.tasks.length) {
                    var task = that.tasks.shift();
                    task();
                }
            })
        }
        addTask(task) {
            this.tasks.push(task);
        }
    }
    // 实现它的单例
    let mapTask = {
        get: function () {
            if( !mapTask.aTask ) {
                mapTask.aTask = new Task();
                mapTask.aTask.draw();
            }
            return this.aTask;
        },
        add: function (task) {
            mapTask.get().addTask(task);
        }
    }

每一次get的时候县先判断mapTask有没有Task的实例，如果没有则是第一次，先实例化一个，做初始化工作，否则直接返回然后执行mapTask.get()的时候就能够保证获取到一个单例。

2.观察者模式

这个模式之前拿出来讲过，现在再炒一次冷饭。

    class Observable{
        constructor(el) {
            this.callback = []
        }
        on (name, fn) {// 添加监听事件
            if (typeof fn !== "function") {
                throw new TypeError("second argument for 'on' method must be a function");
            }
            (callback[name] = callbacks[name] || []).push(fn); // 将回调函数push任务队列
            return el;
        }
        one (name, fn) {// 只监听一次
            fn.one = true;
            return el.on.call(el, name, fn);
        }
        off(name, fn) {// 移除事件
            if (name === "*") {
                callbacks = {};
                return callbacks;
            }
            if (!callbacks[name]) {
                return false;
            }
            if (fn) {
                if (typeof fn !== "function") {
                    throw new TypeError ("second arguments for 'on' method must be a function");
                }
                callbacks[name] = callbacks[name].map(function (fm, i) {
                    if (fm === fn) {
                        callbacks[name].splice(i, 1);
                    }
                });
            } else {
                delete callbacks[name]
            }
        }
        emit (name) {// 触发事件
            if (!callbacks[name] || callbacks[name].length) {
                console.log(name);
                return;
            }
            const args = [].slice.call(arguments, 1);
            callbacks[name].forEach((fn, i) => {
                if (fn) {
                    fn.apply(fn, args);
                    if (fn.one) {
                        callbacks[name].splice(i, 1);
                    }
                }
            })
        }
    }

3.工厂模式

    var taskCreator = {
        createTask: function(type) {
            switch(type) {
                case "map": 
                    return new MapTask();
                case "search":
                    return new SearchTask()
            }
        }
    }
    var mapTask = taskCreator.createTask("map");

工厂模式就是把创建交给一个“工厂”，使用者无需要关心创建的细节.需要那种类型的Task的时候就传一个类型或者产品名字给一个工厂，工厂根据名字去生产相应的产品。

## 面向对象编程原则

- 把共性和特性或者会变和不变的分离出来
- 少用继承，多用组合
- 低耦高聚
- 开闭原则
- 单一职责原则

