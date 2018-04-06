---
layout: post
title: Promise的Review
date: 2018-01-15
tags: [ES6]
---

今天来复习一下关于ES6中promise的相关内容。

Promise相当于异步操作结果的占位符，它不会去订阅一个事件，也不会传递一个回调函数作为目标函数给，而是让函数返回一个Promise。

## Promise的生命周期

每个Promise都会经历一个短暂的生命周期。内部属性[[PromiseState]]被用来表示属性，但是不可读。一个Promise的生命周期有三个阶段，分别是pending，fulfil，reject。

Promise构造函数接受一个函数作为参数，该函数的两个参数分别是resolve和reject，它们是两个函数。resolve的作用是将Promise状态从未完成变为成功。异步操作成功时调用，并将异步操作的结果作为参数传递出去。reject函数的作用是，将Promise对象的状态从未完成变为失败。（pending变为rejected），在异步操作失败时调用，并将异步操作报出的错误作为参数传递出去。

### 利用Promise实现Ajax

    const getJSON = function (url) {
        const promise = new Promise(function (resolve, reject) {
            const handler = function () {
                if (this.readyState !== 4) {
                    return ;
                }
                if (this.status === 200) {
                    resolve(this.response);
                } else {
                    reject(new Error(this.statusText));
                }
            };
            const client = new XMLHttpRequest();
            client.open("GET", url);
            client.onreadystatechange = handler;
            client.responseType = 'json';
            client.setRequestHeader('Accept', "application/json");
            client.send();
        })
        return promise;
    }
    getJSON("/post.json").then(function(json) {
        console.log("Contents:" + json);
    }, function (error) {
        console.error('get wrong', error);
    })