---
layout: post
title: Proxy Reflect API
date: 2018-04-18
tags: [ES6]
---

ES6中添加了一些内建对象，赋予开发者更多访问JavaScript引擎的能力。代理是一种可以拦截并改变底层JavaScript引擎操作的包装器，通过它暴露内部运作的对象，从而让开发者可以创建内建的对象。

## 代理和反射

调用newProxy可创建代替其他目标的底层对象操作，这些底层操作被拦截后会触发响应特定操作的陷阱函数。

发射API以Reflect对象的形式出现，对象中方法的默认特性与相同的底层操作一直，而代理可以复写这些操作，每个代理陷阱对应一个命名和参数都相同的Reflect方法。

    代理陷阱                          复写 特性                      默认特性
    get                             读取一个属性值                 Reflect.get()
    set                             写入一个属性                   Reflect.set()
    has                             in 操作符                     Reflect.has() 
    deleteProperty                  delete操作符                  Reflect.deleteProperty()
    getPrototypeOf                  Object.getPrototypeOf()      Reflect.getPrototypeOf()
    setPrototypeOf                  Object.setPrototypeOf()      Reflect.setPrototypeOf()
    isExtensible                    Object.preventExtensions()   Reflect.preventExtensions()
    preventExtensions               Object.isExtensible()        Reflect.isExtensible()
    getOwnPropertyDescriptor        Object.getOwnPropertyDescriptor()      Reflect.getOwnPropertyDescriptor()
    defineProperty                  Object.defineProperty()      Reflect.defineProperty()
    ownKeys                         Object.keys(),
                                    Object.getOwnPropertyNames(),
                                    Object.getOwnPropertySymbols() 
                                    Object.getOwnPropertyNames()     Reflect.ownKeys()
    apply                           调用一个函数                   Reflect.apply() 
    construct                       用new调用一个函数              Reflect.construct()

每个陷阱复写JavaScript对象的一些内建特性，可以用它们拦截并修改这些特性。如果仍需要使用内建特性，则可以使用相应的反射API方法。创建代理会让代理和反射API的关系变得清楚。

### 创建一个简单的代理

用Proxy构造函数创建代理需要传入两个参数：目标（target）和处理程序（handler）。处理程序是定义一个或多个陷阱的对象，在代理中，处理专门为操作定义陷阱外，其余操作均使用默认疼。不使用任何陷阱的处理程序等价于简单的转发代理，例如：

    let target = {};
    let proxy = new Proxy(target, {});
    proxy.name = "proxy";
    console.log(proxy.name);
    console.log(target.name); // "proxy"
    console.log(target.name); // "proxy"
    target.name = "target";
    console.log(proxy.name); // 'target';
    console.log(target.name); // "target";

这个实例中的代理将所有操作直接转发到目标，将“proxy”赋值给proxy.name属性是，会在目标创建name，代理只是简单地将操作转发给目标，它不会储存这个属性。由于proxy.name和target.name引用都是target.name，因此两者的值相同，并且会一同变化。

### 使用set陷阱

这个可以为我们对每个属性加以验证。如果不符合要求，就报出错误。set陷阱接收四个参数：

- trapTarget 用于接收属性（代理目标的对象）
- key 要写入的属性键（字符串或者Symbol类型）
- value 被写入属性的值
- receiver 操作发生的对象

Reflect.set()是set陷阱对应的反射方法和默认特性，它和set代理陷阱一样也接受相同的4个参数，以方便在陷进中使用，如果这个属性已经设置了陷阱应该返回true，如果未设置返回FALSE。

    let target = {
        name: "target"
    }
    let proxy = new Proxy(target, {
        set(trapTarget, key, value, receiver) {
            if (!trapTarget.hasOwnProperty(key)) {
                if (isNaN(value) {
                    throw new TypeError ('value must be a number');
                })
            }
            return Reflect.set(trapTarget, key, value, receiver);
        }
    });
    proxy.count = 1;
    console.log(proxy.count); // 1
    console.log(target.count); // 1
    proxy.name = "proxy";
    console.log(proxy.name); // "proxy"
    console.log(target.name)  // "proxy"
    proxy.anotherName = "proxy" // TypeError

以上代码就是set陷阱对属性值的一些判断，如果一开始已经存在，那么可以复制，不存在的话必须为Number才可以赋值

### get陷阱验证对象结构

三个参数：

- trapTarget被读取属性的源对象
- key 要读取的属性值（字符串或者Symbol）
- receiver 操作发生的对象

    let proxy = new Proxy({}, {
        get(trapTarget, key, receiver) {
            if (!(key in receiver)) {
                throw new TypeError (`key:${key},is not exit`);
            }
            return Reflect.get(trapTarget, key, receiver);
        }
    })
    proxy.name = 'proxy';
    console.log(proxy.name); // "proxy"
    console.log(proxy.naam) // Type Error 属性不存在

这个实力可以拦截属性的读取操作，并通过in操作符来判断receiver上是否有读取的属性，这里之所以用in操作符检查receiver而不检查trapTarget是为了防止receiver代理含有has陷阱。这样写得话，就会忽略has陷阱，从而得到错误结果，属性不会抛出一个错误，否则使用默认行为。

