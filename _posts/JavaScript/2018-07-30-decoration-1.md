---
layout: post
title: ECMAScript装饰器
date: 2018-07-30
tags: [JavaScript]
---

## Decorator

Decorator是一个JavaScript函数（推荐的纯函数），用于修改属性/方法或类本身。在不改变原有功能的基础上，增强其功能。语法就是在类或者属性方法前面加上@ decorator，decorator指的就是装饰器的名称。

在了解Decorator之前，首先得了解的就是Object.defineProperty的一些相关知识。点击 [这里](http://leunggabou.com/2018/03/01/origin-observer/)

    let descriptor = {
        value: function () {
            return this.color
        },
        writeable: true,
        configurable: true,
        enumberable: false
    }
    let readonly = functin (target, key, descriptor) {// 让Car这个方法成为一个只读的属性，这里的target是Car的原型链prototype
        descriptor.writable = false;
        return descriptor;
    }
    class Car {
        constructor(color) {
            this.color = color;
        }
        @readonly // 将readonly作用到bark方法上
        getColor() {
            return this.color;
        }
    }
    descriptor = readonly(car.prototype, 'getColor', descriptor);
    Object.defineProperty(Car.prototype, 'getColor', descriptor);
    let carObj = new Car('black');
    console.log(carOjbe.getColor()); // black
    carObj.getColor = function () {
        return 'hey hey'
    }
    console.log(carObj.getColor()) // black

如果我们想了解@readonly究竟做了啥，就先看一下定义一个class的时候发生了啥。

    function Car() {}; //  first step
    Object.defineProperty(Dog.prototype, 'getColor', {// second step
        value: function () { return this.color },
        enumerable: false,
        configurable: true,
        writeable: true
    })

对car方法应用了@readonly之后，js引擎就会在进行步骤二之前调用这个decorator：

    let descriptor = {
        value: function () {return this.color },
        enumerable: false,
        configurable: true,
        writable: true
    }
    descriptor = readonly(Car.prototype, 'getColor', descriptor) || descriptor;
    Object.defineProperty(Car.prototype, 'getColor', descriptor) 

所以Decorator作用就是返回一个新的descriptor，并把这个新返回的descriptor应用到目标方法上。

### 作用在类上的decorator

作用在方法上的decorator接收的第一个参数（target）是类的prototype；如果把一个decorator作用到类上，则它的第一个参数target是类本身：   

    function doge(target) {
        target.isDoge = true;
    }

    @doge
    class Dog {}
    console.log(Dog.isDoge);
    // true

### 真实场景

将Decorator这个特性应用于数据定义层，实现一些类似于类型检查、字段等功能。

关于数据定义层，其实就是应用内出现的各种实现数据的定义，也就是MVVM中的M层，Model本身不提供数据的管理和流通，只负责定义某个实体本身的属性和方法，例如页面有一辆车的模块，我们就定义一个CarModel，用来描述车辆的颜色，价格，品牌等信息。

前端应用内定义明确的Model，核心几点：

- 提高可维护性。将数据源头的实体做一个固定而标准的描述，这个对于串联理解整个应用非常重要。
- 提高确定性。直接在model中可以了解相关信息。
- 提高开发效率。在这一层做一些数据映射和类型检查工作。

