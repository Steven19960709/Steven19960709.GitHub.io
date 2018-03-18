---
layout: post
title: 阿里巴巴 一面  面经
date: 2018-03-09
tags: [Interview]
---



刚刚面完阿里，写一下面经，问了听过问题的，但是不是普通的一些初级问题，主要记下当时不懂的东西，接下来逐个解决。

1.你的项目为什么要使用redux作为状态管理？
2.怎样解决js中的内存泄漏。
3.怎样解决不同设备的兼容性问题
4.CSS3 中的新属性
5.ajax的深入了解
6.React的diff算法
7.正则表达式的单词边界检测
8.Set和Map的区别
9.readyState的各种状态码
10.路由相关知识
11.history的一些理解 ，你用的多是hash还是history。
12.fixbetween


这篇文章需要解决 JavaScript内存泄漏。

先说一下什么是内存泄漏吧，对于持续运行的服务进程，必须及时释放不在用到的内存。否则，内存占用越来越高，可能会导致进程崩溃。 这样，不再用到的内存，没有及时释放，就叫做内存泄漏。

## 垃圾回收机制

最常使用的方法叫做引用计数（reference counting），语言引擎有一张‘引用表’，保存了内存里面所有的资源的引用次数。如果一个值的引用次数是0，就表示这个值不再用到了，因此可以将这块内存释放。

如果一个值不再需要了，但是引用数却不为0，垃圾回收机制无法释放这块内存，从而导致内存泄漏。

可以通过手动的给一个变量置为null。

发现内存泄漏：

- 通过浏览器查看内存占用。如果内存占用越来越大，不是平稳过渡就是有内存泄漏。
- 通过命令行，使用Node提过的process.memoryUsage()方法。这个方法会返回Node的四个内存信息，包括以下几个字段：

    - rss(resident set size) : 所有内存占用，包括指令区和堆栈。
    - heapTotal: '堆'占用的内存，包括用到的和没用到的。
    - heapUsed: 用到的堆的部分。
    - external: v8 引擎内部的C++对象占用的内存

### WeakMap

及时清除引用非常重要，但是如果一时不记得清除，还是会发生内存泄漏。

最好能有一种方法，在新建引用的时候就声明，那些引用必须手动清除，那些引用可以忽略不计，在其他引用消失以后，垃圾回收机制就可以释放内存。

于是ES6提出了两种新的数据结构：WeakSet和WeakMap。它们对于值的引用都是不计入垃圾回收机制的，所以名字里面有一个weak，表示这是弱引用。

例如：

    const wm = new WeakMap();
    const element = document.getElementById('example');
    wm.set(element, 'something');
    wn.get(element) // 'some information'

说是WeakMap的引用都是弱引用，它可以在没有引用的情况下进行垃圾回收。

然后js引擎内置的两个方法来进行垃圾回收分别是引用计数和标记清除，两个都是可以的。

### 内存泄漏的情况

还有情况是这样的，如果当原有的DOM被移除时，子节点引用没有被移除就是无法回收。

    var select = document.querySelector;
    var treeRef = select('#tree');
    var leafRef = select('#leaf'); //在DOMtree中leafRef是treeFred的一个子节点；
    select('body').removeChild(treeRef); //#tree 不能被回收，因为treeRef还在

    //解决方法 
    treeRef = null;
    leafRef = null; // 这样最后treeRef可以被释放了

timer定时器泄露

    var val = 0;
    for (var i = 0; i < 9000; i++) {
        var buggyObject = {
            callAgain: function () {
                var ref = this;
                val = setTimeout(function () {
                    ref.callAgain();
                }, 90000);
            }
        }
    }
    buggyObject.callAgaiin();
    //想回收？
    buggyObject = null;
    //这样才能真正回收
    clearTimeout(val);
    buggyObject = null;

## 在node角度来看

Node对内存泄漏十分敏感，一旦线上应用有成千上万的流量，哪怕是一个字节的内存泄漏都会造成堆积，垃圾回收过程中将会耗费更多的时间进行对象扫描，应用响应缓慢，直到进程内存溢出，应用崩溃。那么在V8引擎下面造成溢出的话很难排查，主要有这么几个原因：

- 缓存
- 队列消费不及时
- 作用域未释放

### 慎将内存当做缓存

缓存在应用中举足轻重，可以十分有效地节省资源，效率比I/O高，但是如果一个对象被当做缓存来用的话，意味着它将会常驻在老生代中。缓存存储的越多，长期存活的对象也就越多，这也将导致垃圾回收在进行扫描和整理时对这些对象做无用功。

### 关注队列状态

一旦消费速度低于生产速度，那么将会形成堆积。深度解决这个问题就是应该监控队列长度，一旦堆积，应当通知监控系统。