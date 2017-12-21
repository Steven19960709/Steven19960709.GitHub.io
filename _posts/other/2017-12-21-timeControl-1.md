layout: post
title: 关于函数防抖的一些知识（1）
tags: [other]
date: 2017-12-21
---

最近一直都在忙实习的事情或者忙完实习就要忙学习，，准备考试，所以一直都没有更新过文章，所以大家也不要催啦，今天要更新了，讲一下关于函数防抖的东西。

首先要了解一些概念。JavaScript遵循事件驱动的编程范例，即一些行为可以激活一些响应，并且这些响应仅在发生了特定的行为时才被激活。我们称这些行为events（事件）和callbacks（响应/回调）。连续的事件称之为event stream（事件流）。

这些行为发生的速度不是我们能手动控制的。但是我们可以控制和如何激活正确的响应。即如下技术：

- Throttle
- Debounce
- Immediate

## Throttle 

现代浏览器中，帧速率60fps是流畅性能的目标，给定我们16ms的时间预算用于响应一些时间所有需要的更新。这样可以推断，如果每秒发生n个事件并且执行回调，需要t秒的时间，为了流畅运行则有：

    1 / n >= t (s)
    1000 / n >= t (ms)

例如，当我们使用mouseMove事件的时候，会产生MouseMove事件的数量美妙超过60次，这样回调就超过16.7ms，那就开始凌乱了。

    let then = 0;
    log = () => {
        let now = Date.now();
        if (1000 / (now - then) > 60) {
            console.log("it is over 9000!!!');
        }
        then = now;
    }

### 实现

Throttle允许我们限制我们激活响应的数量，我们可以限制每秒回调的数量。反过来，就是在激活下一个回调之前需要等待多长时间。

    let delta = 1000;
    var then = 0;
    function log() {
        console.log('foo');
    }
    function throttleLog() {
        var now = Date.now();
        if (now - then >= delta) {
            log();
            then = now;
        }
    };
    window.onmousemove = throttleLog;

这个方法是通过限制时间来触发回调函数，另一种方法是使用setTimeout来实现相同的结果，但是不是检查时间差，而是检查状态电话·变化。

        var delta = 1000;
        var safe = true;
        function log() {
            console.log('foo');
        }
        function throttledlog() {
            if (safe) {
                log();
                safe = false;
                setTimeout(function() {
                    safe = true;
                }, delta);
            }
        };
        window.onmousemove = throttleLog;

这样每隔delta时间，safe的状态就会改变一次，这样就可以产生于方法一的效果。

## Debounce

这个就是防抖的意思，来源于电子学，意思是，当我们按下开关的时候，数字电路可能会读到多次的按压，因为按钮的物理属性（金属触点，弹簧，磨损件等）。去抖动就是意味着采集到的所有这些波动的信号，并把它当做一个。

例如：键盘事件中的keydown和keyup，当我们按下键盘的时候，keydown事件会一直触发，但是keyup事件只有在被释放的时候才会触发。这种行为上的差异可以确定输入是或否已完成，在某种程度上说，我们可以说keydown是原始输入，keyup是去抖动输入。

### 实现

当事件发生的时候，我们不会立即激活回调。相反，我们会等待一段时间，并检查相同事件是否再次触发，如果是，重置定时器，否则再次等待。如果在等待期间没有发生相同的事件，立即激活回调。

    let delta = 1000;
    var timeoutID = null;
    function log() {
        console.log('foo');
    }
    function debounceLog() {
        clearTimeout(timeoutID); //reset timer;
        timeoutID = setTimeout(function() {
            //wait for some time;
            //and check if event happens again
            log();
        }, delta);
    }
    window.onkeydown = debounceLog;

## Immediate 

Immediate根Debounce有点区别。它是立即激活回调，然后等待后续事件在一定事件内触发，而不是Debounce那样等待后续事件触发，然后再激活。

实现：利用一个状态变量来检查是否应该激活我们的回调（这个其实在开发当中很常使用）我们在Debounce不需要一个，因为timeoutID隐式管理这部分。

    var delta = 1000;
    var timeoutID = null;
    var safe = true;
    function log() {
        console.log('foo');
    }
    function immediatedLog() {
        if(safe) {
            log();
            safe = false;
        }
        clearTimeout(tiemoutID);
        timeoutID = setTimeout(function() {
            safe = true;
        },delta);
    };
    window.onkeydown = immediatedLog;

那么这篇文章就先讲到这，下一篇就开始将实例。