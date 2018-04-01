---
layout: post
title: NodeJs GET/POST 请求
date: 2018-04-01
tags: [node]
---

这部分内容主要是用来处理表单等一些浏览器与服务器交互的请求。

### 获取GET请求内容

nodejs中的url模块中的parse函数提供一个功能，用来解析url。

    const http = require('http');
    const url = require('url');
    const server = http.createServer(function (req, res) {
        res.writeHead(200, {"Content-Type":"text/plain;charset=uft-8"});
        console.log(url.parse(req.url, true));
        res.end()
    })

那么当我们访问localhost:3000/user?name=xx&url=xxx.com的时候，就会给我们返回这样的信息：

    URL {
        protocol: null,
        slashes: null,
        auth: null,
        host: null,
        port: null,
        hostname: null,
        hash: null,
        search: '?name=xxx&url=xxx',
        query: { name: 'xxx', url: 'xxx,com' },
        pathname: '/user',
        path: '/user?name=xxx&url=xxx',
        href: '/user?name=xxx&url=xxx' 
    }

我们可以进一步获取对应信息。

    const urlQuery = url.parse(req.url, true).query;
    res.write('data name:'+urlQuery.name); // 'data name : xxx'
    res.write('data.url:'+urlQuery.url); // 'data url : xxx.com'
    res.end();

### 获取POST请求内容

POST请求的内容全部的都在请求体中，http ServerRequest并没有一个属性内容为请求体，原因是等待请求体输出可能是一个耗时的工作。比如上传文件。nodejs默认不会解析请求体，需要时，要手动解析。

    http.createServer(function (req, res) {
        const post '';
        req.on('data', function (chunk) {
            post += chunk;
        });
        req.on('end', function () {
            post = querystring.parse(post);
            res.end(util.inspect(post))'
        })// 主要监听是否有数据传输过来
    })

### 整一个服务器

    const fs = require('fs');
    const server = http.createServer( function (req, res) {
        let body = '';
        let pathName = url.parse(req.url).pathname;
        if (pathName === '/') {
            fs.readFile('./index.html', function (err, data) {
                res.write(data.toString());
                res.end();
            })
        } else {
            res.end(404);
        }
    })
    server.listen(80, '127.0.0.1');