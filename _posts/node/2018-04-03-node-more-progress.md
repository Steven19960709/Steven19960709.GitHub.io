---
layout: post
date: 2018-04-03
tags: [node]
title: Nodejs多进程
---

Nodejs是以单线程的模式运行的，但它使用的是事件驱动来处理并发，这样有助于多核CPU创建多个子进程，从而提高性能。

每个子进程总是带有三个流对象：child.stdin,child.stdout,child.stderr。他们可能共享父进程的stdio流，或者也可以是独立的被导流的流对象。

Node提供了child_process模块来创建子进程有以下几个方法。

### exec()方法

child_process.exec()使用子进程执行命令，缓存子进程的输出，将子进程的输出以回调函数参数的形式返回。

    child_process.exec(command([,options],callback)

参数有这几个：

- command：字符串，将要运行的命令，参数使用空格隔开
- options：对象，可以是：

    - cwd，字符串，子进程当前工作目录
    - env，对象，环境变量键值对
    - encoding，字符编码（默认utf8）
    - shell，自发货车，将要执行命令的shell
    - timeout，数字，超时时间
    maxBuffer，数字，在stdout或者stderr中允许存在的最大缓冲，如果超出那么子进程将会被kill
    - killSignal, 字符串，结束信号
    - uid，数字，设置用户进程的ID
    - giddy，数字，设置进程组的ID

- callback：回调函数，三个参数，error，stdout，stderr

下面例子来创建一个子进程，然后在子进程中输出进程号。

    //support.js 
    console.log('work process' + process.argv[2] + 'running');
    //main.js
    const fs = require('fs');
    const child_process = require('child_process');
    for (var i = 0; i < 3; i++) {
        let workProcess = child_process.exec('node support.js'+i, function (error, stdout, stderr) {
            if (error) {
                console.log(error.stack);
                console.log('Error code :' + error.code);
                console.log('signal received:' + error.signal);
            }
            console.log('stdout' + stdout);
            console.log('stderr' + stderr);

        })
        workerProcess.on('exit', function (code) {
            console.log('workProcess has been quit， quit code' + code);
        })
    }

### spawn() 方法

child_process spawn使用指定的命令行参数创建新进程。

    child_process.spawn(command,[, args], [,options])

#### 参数

- command： 将要运行的命令
- args：Array， 字符串参数数组
- options：Object,如下字段：

    - cwd String 子进程的当前目录
    - env Object 环境变量键值对
    - stdio Array|String 子进程的stdio配置
    - detached Boolean 这个子进程将会变成进程组的领导
    - uid Number 设置用户进程的Id
    - gid Number 设置进程组的ID

spawn()方法返回流，在进程返回大量数据使用。

    const fs = require('fs');
    const child_process = require('child_process');
    for (let i = 0; i < 3; i++) {
        let workerProcess = child_process.spawn('node', ['supports.js', i]);
        workerProcess.stdout.on('data', function (data) {
            console.log('stdout:' + data);
        })
        workerProcess.stderr.on('data', function (data) {
            console.log('stderr' + data);
        })
        workerProcess.on('close', function (code) {
            console.log('process exit' , code);
        })
    }

### fork 方法

child_process.fork是spawn方法的特殊形式，用于创建线程。

    child_process.fork(modulePath[, args][,options]);

参数说明如下：

modulePath： String，将要在子进程中运行的模块

args： Array 字符串参数数组

options：Object

    cwd String 子进程的当前工作目录
    env Object 环境变量键值对
    execPath String 创建子进程的可执行文件
    execArgv Array 子进程的可执行文件的字符串参数数组（默认： process.execArgv）
    silent Boolean 如果为true，子进程的stdin，stdout和stderr将会被关联至父进程，否则，它们将会从父进程中继承。（默认为：false）
    uid Number 设置用户进程的 ID
    gid Number 设置进程组的 ID

返回的对象除了拥有ChildProcess实例的所有方法，还有一个内建的通信信道。

    const wroker_process = child_process.fork('support.js', [i]);
    worker_process.on('close' ,function (code) {
        console.log('porcess exit' , code);
    })