---
layout: post
title: 异常捕获
date: 2018-08-06
tags: [share]
---

在监测动画相关性能，例如渲染时间，预加载的相关参数这些方面，前端的性能检测是非常重要的。另外，前端对异常的监控和性能的统计。对于前端的性能与异常上报的相关知识也是相当重要的。

## 异常捕获

前端来说，我们需要的异常捕获为以下两种：

- 接口调用的情况
- 页面逻辑是否错误，例如，用户是否进入页面后显示白屏；

对于接口调用情况，在前端通常需要上报客户端相关参数，例如：用户Os与浏览器版本，请求参数，而对于页面逻辑是否错误问题，通常除了用户OS与浏览器版本外，需要的是报错的堆栈信息与具体报错位置。

### 异常捕获方法

可以通过全局监听异常来捕获，通过window.onerror或者addEventListener：    

    window.onerror = function(errorMessage, scriptURL, lineNo, columnNo, error) {
        console.log('errorMessage:' + errorMessage); // 异常信息
        console.log('scriptURL: ', scriptURL) // 异常文件路径
        console.log('lineNo: ' + lineNo) // 异常行号
        console.log('columnNo: ' + columnNo); // 异常列号
        console.log('error' + error); // 异常堆栈信息
        // ...
        // 异常上报
    }
    throw new Error('this is an Error');

<img src="http://ovk2ylefr.bkt.clouddn.com/performance.png">

通过window.onerror事件，可以得到具体的异常信息、异常文件的URL，异常的行号和列号及异常的堆栈信息，在捕获异常后，统一上报到日志服务器。

使用addEventListener方法来进行异常上报：

    window.addEventListener('error', () => {
        console.log(error)
    })
    throw new Error('this is an Error')

### try...catch

使用try...catch虽然可以很好滴进行异常捕获，不至于使得页面由于一处错误挂掉，但是try.catch捕获方式显得使得try...catch包裹，影响代码可读性。

## 常见问题

1.跨脚本无法准确捕获异常

通常情况下，会把静态资源，如JavaScript脚本放到专门的静态资源服务器，亦或者cdn中。跨域后的window.onerror根本不能获取到正确地异常信息，而是返回一个script error，解决方案： 对script标签增加一个crossorigin = 'anonymous',并且服务器添加
Access-control-Allow-Origin.

2.sourceMap

在生产环境下的代码经过webpack打包后压缩混淆的代码，会遇到这种情况，就是所有的报错都在第一行，这个时候解决方法是开启webpack的source-map，我们利用webpack打包后的生成一的一份.map脚本文件就可以让浏览器对错误位置进行跟踪。（兼容性：目前只用Chrome和firefox才能对这个进行支持，但是可以引入npm库来支持，详情[click here](https://github.com/mozilla/source-map)）

另外一种方式就是对接收的日志信息使用source-map今夕，以避免代码的泄露造成风险：

    const express = require('express');
    const fs = require('fs');
    const router = express.Router();
    const sourceMap = require("source-map");
    const path = require('path');
    const resolve = file => path.resolve(__dirname, file);

    router.get('/error/', async functoin (req,res) {
        let error = JSON.parse(req.query.error);
        let url = error.scriptURI; // 压缩文件路径
        if (url) {
            let fileUrl = url.slice(url.indexOf('client/')) + '.map'; // map文件路径
            //解析sourcesMap
            let consumer = await new sourceMap.SourceMapConsumer(fs.readFileSync(resolve('../' + fileUrl), 'utf8'));// 返回一个promise对象
            // 解析原始报错数据
            let result = consumer.originalPositionFor({
                line: error.lineNo, // 压缩后的行号
                column: error.columnNo // 压缩之后的列号
            })
            console.log(result)
        }
    })
    module.exports = router;

### Vue异常捕获

在vue中，异常可能被Vue自身给try  catch了，不会传到window.onerror事件触发，这个时候通常可以使用Vue.config.errorhandler这样的Vue的全局配置，可以在Vue指定组件的渲染和观察期间未捕获错误的处理函数。这个处理函数被调用时，可获取错误信息和Vue 实例。

    Vue.config.errorHandler = function (err, vm, info) {
        // handle error
        // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
        // 只在 2.2.0+ 可用
    }

