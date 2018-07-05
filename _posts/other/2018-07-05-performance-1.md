---
layout: post
title: 程序性能
date: 2018-07-05
tags: [share]
---

### 异步提升性能

异步模式可以显著的提高web的性能。例如，当我们需要发送两个Ajax，两个请求都成功在进行下一步操作。简单一个思路就是使用同步的方式，第一个成功了，再请求下一个。第二个方式，就是使用Promise异步请求的方式，可以利用Promise.all()这个方法，并行的发出两个请求。

显然第二种模式要比第一种更加高效。而更高的性能通常也会带来更好的用户体验。

这种局部性提高性能的方法还有很多，之前也写过相关的内容具体点击[here](http://leunggabou.com/2017/09/29/HighProforman-3/)

这里需要讲的是全局性的，程序级别上的性能优化问题。

### Web Worker

之前也提过Web Worker 。如果有一些处理密集型的任务需要执行，但不希望他们都在主线程运行（这可能减慢浏览器UI线程运行），这个时候可能就需要JavaScript能够以多线程的方式来运行。

但是JavaScript是单线程运行的，而且是唯一方式。这个时候，WebWorker就有用了。

HTML6新增了一个叫做Web Worker的特性，可以在浏览器环境中新增一个独立的线程，用来执行不同的程序。

可以在JavaScript主程序中实例化一个Worker：

    let w1 = new Worker('https://JSURL')

这个url应该指向的是一个JavaScript文件位置，这个文件将会被加载到worker中。然后浏览器就会启动一个独立的县城，让这个文件在这个线程中做为独立的程序运行。

这种利用url创建的worker称为专用worker（Dedicated Worker）。除了提供一个指向外部文件的URL，当然，也可以填一个Blob类型的url，创建一个在线的Worker，本质就是一个存储在单个（二进制）值中的在线文件。

Worker之间以及它们和主程序之间，不会共享任何作用于或资源，，而是通过一个基本的事件消息机制相互联系。Worker w1对象是一个事件侦听者和触发者，可以通过订阅他来获得这个Worker发出的事件以及发送事件给这个Worker。

    w1.addEventListener('message', function (evt) {
        // evt.data 数据 
    })
    w1.postMessage('somethings news'); // 发送事件

具体的worker可以点击[Web worker](http://leunggabou.com/2018/05/09/WebWorker-1/), [Service Worker](http://leunggabou.com/2018/04/12/service-worker/)

### SIMD

单指令多数据（SIMD）是一种数据并行方式，与Web Worker的任务并行相对，因为这里的重点实际上不再是程序逻辑分成并行的快，而是并行处理数据的多个位。通过SIMD，线程不在提供并行。取而代之的是，现代CPU通过数字“向量”，以及可以在所有这些数字上并行操作的指令，来提供SIMD功能。这是利用低级指令集并行的底层运算。

但是，目前Web不在追求实现SIMD，而是转向WebAssembly进行支持。这里就不深入介绍了。

### asm.js

asm.js是指JavaScript语言中可以高度优化的一个子集。通过小心避免某些难以优化的机制，如垃圾回收，类型强制转换等，它的风格会被JavaScript引擎识别，并大幅度优化。

asm.js主要用来追踪一系列达成一致的备选优化方案而不是对JavaScript引擎的一组要求。

对JavaScript性能影响最大的因素是内存分配、垃圾回收、和作用域访问。asm.js对这些问题提出一个解决方案就是，声明一个更正式的asm.js模块，导入一个严格规范的命名空间，用必要的符号，而不是通过词法作用域使用管局的符号。然后，引入一个堆，简单理解就是一个带类型的ArrayBuffer，例如：

    let heap = new ArrayBuffer(0x10000); // 64k堆

asm.js模块可以在这个缓冲区存储和获取值，不需要付出任何内存分批额和垃圾回收的代价。

那么这部分的内容就先讲到这，希望大家能有所收获！