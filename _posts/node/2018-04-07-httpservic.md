---
layout: post
title: NodeJs Http Service
date: 2018-04-07
tags: [node]
---


## 创建http服务器

    const http = require('http');
    const service = http.createServer((req, res) => {
        res.writeHead(200, {
            "Content-Type": "text/plain"
        })
        res.end('hello world');
    }

createServer方法返回一个http.server的类的实例。那么当一个server实例被创建的时候会触发一些事件，例如connection和request事件。

    server.on('connection', (req,res) => {
        console.log("connected");

    })
    server.on('request', (req, res) => {
        console.log('request is coming');
    })

## 处理http请求

1，method，url，header

当处理http请求时，最先做的就是请求url和method等信息。url的值为取出的hash部分，不包含域名部分。例如：请求"leunggabou.com/post/2018-04-07-httpservic"那么就返回“post/2018-04-07-httpservic”

2,header

node的http请求头是由一个对象表示：

    {
        "content-length": "123",
        "content-type": "text/plain",
        "connection": "keep-alive",
        "host": "mysite.com",
        "accept": "/"
    }

3.response 

状态码的设置会被忽略，但是需要手动的设置的，因为如果被忽略默认200。

设置response header

    response.setHeader("content-type","application/json");

response.writehead

这个方法用来设定response header单个属性的内容。

    response.writeHead(304, {
        "Content-Length": Buffer.byteLength(body),
        "Content-Type": "text/plain"
    })

response对象是一个writetableStream实例，可以直接调用write方法进行写入，写入完成狗，在调用end方法将该stream发送到客户端。

response.end()，在每个http请求最后都会调用这个，否则会一直转圈。