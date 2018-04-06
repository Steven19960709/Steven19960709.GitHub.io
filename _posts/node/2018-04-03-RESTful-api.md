---
layout: post
title: Nodejs RESTful API
date: 2018-04-03
tags: [node]
---

## REST

REST即表述性状态传递（Representational State Transfer ,简称REST）,是一种软件架构风格。

表述性状态转移是一组架构约束条件和原则。满足这些条件和原则的应用程序或设计就是RESTful。REST是设计风格，而不是标准，REST通常基于HTTP，URL，和XML以及html。

### HTTP方法

REST基本架构的四个方法：

- GET 获取数据
- PUT 更新添加数据
- DELETE 删除数据
- POST 添加数据

### RESTful Web Services

Webservice 是一个平台独立的 低耦合的，自包含的，基于可编程的web的应用程序。

### 创建RESTful

先创建一个json数据资源文件users.json

    {
        "user1": {
            "name": "mahesh",
            "password": "password",
            "profession": "teacher",
            "id": 1
        },
        "user2": {
            "name": "suresh",
            "password": "password2",
            "profession": "librarian",
            "id": 2
        },
        "user3": {
            "name": "ramesh",
            "password": "password3",
            "profession": "clerk",
            "id": 3
        }
    }

之后，我们就可以创建一个服务器，然后进行一些增删改查。

    const fs = require('fs');
    const express = require('express');
    const app = express();
    app.get('/getlist', function (req, res) {
        if(err) {
            console.log(err);
        }
        da
        fs.readFile(__dirname + './uers.json', "uft8", function (err, data) {
            data = JSON.parse(data);
            res.send(JSON.stringify(data));
            res.end()
        })
    })
    app.post('/postuser', function (req, res) {//增加字段
        fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
            data = JSON.parse( data );
            data["user4"] = user["user4"];
            console.log( data );
            res.end( JSON.stringify(data));
        });
    })
    app.listen(80, function () {
        console.log('your app is listen in 127.0.0.1');
    })

