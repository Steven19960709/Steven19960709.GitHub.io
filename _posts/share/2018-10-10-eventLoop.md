---
layout: post
title: EventLoop
date: 2018-10-10
tags: [JavaScript]
---

复习一下关于事件队列的相关知识.

JavaScript是单线程的,通过使用异步而不阻塞主进程执行.那么是怎样实现的呢?

## 浏览器环境

浏览器环境下，会维护一个任务队列，当异步任务到达的时候加入队列，等待事件循环到合适的时机执行。

js引擎会维护两中任务队列:

- Task(macroTask): setTimeout, setInterval, setImmediate, I/O, UI rendering
- microTask: promise, process.nextTick, Object.observe, MutationObserver, MutationObserver.

区别在哪?

    setTimeout(functoin () {
        console.log(4);
    })
    let promise = new Promise(function executor(resolve) {
        console.log(1)
        for (let i = 0; i < 10000; i++) {
            i == 9999 && resolve()
        }
        console.log(2);
    }).then(function () {
        console.log(5)
    });
    console.log(3)
    // result: 1, 2, 3 5 4

可以看到,then的事件比setTimeout任务先执行了.Promise注册任务属于micro Task,setTimeout属于Task, microTask和Tasks并不在于同一个队列中,他们的调度机制也不是相同的.

    1.event-loop Start
    2.microTasks队列开始清空
    3.检查Tasks是否清空有则跳到4,没有则跳到6
    4.从Tsks队列中抽取一个任务执行.
    5.检查microTasks是否清空,若有则跳到2,否则3.
    6.结束eventloop

又如:

    setTimeout(function () {
        console.log(4)
    }, 0);
    setTimeout(function () {
        console.log(6);
        promise.then(function () {// 这里会检查一次microTask队列,执行.所以先打印出8,最后才是7
            console.log(8)
        });
    }, 0);
    setTimeout(function () {
        console.log(7);
    }, 0);
    let promise = new Promise(function executor(resolve) {
        console.log(1);
        for (let i = 0; i < 10000; i++) {
            i === 9999 && resolve();
        }
        console.log(2);
    }).then( () => {
        console.log(5)
    })
    console.log(3)
    // result 1 2 3 5 4 6 8 7

microTasks会在每个Task执行完毕之后检查清空,而这次event-loop的新task会在下次event-loop检测.

### Node环境

实际上,nodejs环境下,异步的实现根据操作i痛的不同会有所差异.而不同的异步方式处理肯定也是不相同的,其并没有严格按照js单线程的原则;运行环境有可能通过其他线程完成异步,当然,js引擎还是单线程的.

nodejs使用了Google的V8解析引擎和Marc Lehmann的libev.Nodejs将事件驱动的I/O模型与适合这个模型的编程语言JavaScript融合在一起.

    1.times: 这个阶段执行setTimeout()和setInterval()设定的回调
    2. I/Ocallbacks,执行几乎所有的回调,除了close回调,和setImmediate()的回调.
    3.idle,prepare: 进内部使用
    4.poll:获取新的I/O时间;node会在适当的条件下阻塞在这里.
    5.check: 执行setImmediate()设定的回调.
    6.close callback: 执行比如socket.on('close,() => {})的回调.

### 阶段解析

timer: 每个timer指定一个下限时间而不是准确时间,在达到这个下限时间后执行回调.在指定的时间后,timers会尽可能地执行回调,但系统调度或者其它回调的执行可能会延迟他们.

技术上来说, poll阶段控制timers什么时候执行.

I/O callbacks: 这个阶段执行一些系统的回调.比如TCP错误,例如socket在想要连接的时候收到ECONNREFUSED,类unix系统会等待已报告错误.这就会放到I/Ocallbacks阶段的队列执行.

poll:poll阶段的功能有两个

- 执行timer阶段到达时间上限的任务.
- 执行poll阶段的任务队列.

如果进入poll阶段,并且没有timer阶段加入的任务,将会发生以下情况:

- 如果poll队列不为空的话,会执行poll队列直到清空或者系统回调数达到上限
- 如果poll队列为空:
    - 如果设定了setImmediate回调,会直接跳到check阶段.如果没有setImmediate回调,会阻塞住进程,并等待新的poll任务加入并立即执行.

check:这个阶段在 poll 结束后立即执行，setImmediate 的回调会在这里执行。

一般来说，event loop 肯定会进入 poll 阶段，当没有 poll 任务时，会等待新的任务出现，但如果设定了 setImmediate，会直接执行进入下个阶段而不是继续等。

close:close 事件在这里触发，否则将通过 process.nextTick 触发。

    let fs = require('fs');
    function someAsyncOperation (callback) {
        fs.readFile('./filename.txt', callback)
    }
    let timeoutScheduled = Date.now();
    setTimeout(function () {
        let delay = Date.now() - timeoutScheduled;
        console.log(delay + 'ms.have passed since the task start')
    }, 100)
    someAsyncOperation(() => {
        let startCallback = Date.now();
        // cost 10ms
        while( Date.now() - startCalback < 10) {
            // just do something
        }
    })

当event loop进入 poll 阶段，它有个空队列（fs.readFile()尚未结束）。所以它会等待剩下的毫秒， 直到最近的timer的下限时间到了。当它等了95ms，fs.readFile()首先结束了，然后它的回调被加到 poll 的队列并执行——这个回调耗时10ms。之后由于没有其它回调在队列里，所以event loop会查看最近达到的timer的 下限时间，然后回到 timers 阶段，执行timer的回调。所以在示例里，回调被设定 和 回调执行间的间隔是105ms。

setImmediate() vs setTimeout():

两者的不同，他们的执行阶段不同，setImmediate() 在 check 阶段，而settimeout 在 poll 阶段执行。但，还不够。来看一下例子

    setTimeout( () => {
        console.log('timeout')
    }, 0)
    setImmediate(() => {
        console.log('immediate')
    })
    // node command to excude this command
    node timeout_imediate.js
    timeout
    immediate
    node timeout_imediate.js
    immediate
    timeout

结果居然是不确定的，why？

首先进入timer阶段，如果我们的机器性能一般，那么进入timer阶段时，1毫秒可能已经过去了（setTimeout(fn, 0) 等价于setTimeout(fn, 1)），那么setTimeout的回调会首先执行。
如果没到一毫秒，那么我们可以知道，在check阶段，setImmediate的回调会先执行。
那我们再来一个

    let fs = require('fs')
    fs.readFile(__filename, () => {
        setTimeout(() => {
            console.log('timeout')
        }, 0)
        setImmediate(() => {
            console.log('immediate')
        })
    })
输出始终为

    $ node timeout_vs_immediate.js
    immediate
    timeout:

 fs.readFile 的回调执行是在 poll 阶段。当 fs.readFile 回调执行完毕之后，会直接到 check 阶段，先执行 setImmediate 的回调。

process.nextTick():nextTick 比较特殊，它有自己的队列，并且，独立于event loop。 它的执行也非常特殊，无论 event loop 处于何种阶段，都会在阶段结束的时候清空 nextTick 队列。