---
layout: post
title: cookies和Storage的区别
tags: [Interval,network]
date: 2017-10-01
---

今天继续总结上次面试遇到的问题，就关于cookies和localStorage和SessionStroage的区别来讲一讲。

首先三者都是与存储有关的，但是它们之间有很多区别。

sessionStorage和localStorage是HTML5 WebStorage API提供的，可以方便的在web请求之间保存数据，有了本地数据，就可以避免数据和服务器间不必要的来回传递了。

##  WebStorage 

Web Storage的概念和cookies相似，区别是他是用于更大的内容存储，cookies的大小受限，并且，每一次请求一个新的页面cookie都会被发送过去，无形之中会浪费带宽，另外cookie不可以用来跨域使用。

web storage自带setItem，getItem，removeItem等接口，而cookie则需要自己封装。

WebStorage的优势

- Web Storage 拓展了cookie的4K限制

- Web Storage会可以将第一次请求的数据直接存储到本地，这个相当于一个5M大小的针对于前端页面的数据库，相比于cookie可以节约带宽，但是这个却是只有在高版本的浏览器中才支持的

Web Storage的局限

- 浏览器的大小不统一，并且在IE8以上的IE版本才支持Web Storage这个属性

- 目前所有的浏览器中都会把Web Storage的值类型限定为string类型，这个在对我们日常比较常见的JSON对象类型需要一些转换

- Web Storage在浏览器的隐私模式下面是不可读取的

- Web Storage本质上是对字符串的读取，如果存储内容多的话会消耗内存空间，会导致页面变卡

- Web Storage不能被爬虫抓取到

localStorage与sessionStorage的唯一一点区别就是localStorage属于永久性存储，而sessionStorage属于当会话结束的时候，sessionStorage中的键值对会被清空



### localStorage和sessionStorage操作

localStorage和sessionStorage都具有相同的接口

set:

    sessionStorage.setItem("key","value")
    localStorage.setItem("site","somethingelse")

get: 

    sessionStorage.getItem("key");
    localStorage.getItem("site");

remove:

    sessionStorge.removeItem(key)
    localStorage.removeItem(site)

更强大的一点就是，localStorage和sessionStorage可以相对对象那样使用“.”或者"[]"，来进行数据存储。

    var storage = window.localStorage;
    storage.key1 = "hello";
    storage["key2"] = "world";
    console.log(str["key1" ]+str["key2"]);//helloworld

### 实现遍历

sessionStorage和localStorage提供的key()和length可以方便的实现存储的数据遍历，例如下面的代码：

    var storage = window.localStorage; 
    for (var i=0, len = storage.length; i  <  len; i++){     
        var key = storage.key(i);     
        var value = storage.getItem(key);     
        console.log(key + "=" + value); 
    }

## cookies

cookie 是存储于访问者的计算机中的变量。每当同一台计算机通过浏览器请求某个页面时，就会发送这个 cookie。你可以使用 JavaScript 来创建和取回 cookie 的值。

### 名字 cookie

当访问者首次访问页面时，他或她也许会填写他/她们的名字。名字会存储于 cookie 中。当访问者再次访问网站时，他们会收到类似 "Welcome John Doe!" 的欢迎词。而名字则是从 cookie 中取回的。

### 密码 cookie

当访问者首次访问页面时，他或她也许会填写他/她们的密码。密码也可被存储于 cookie 中。当他们再次访问网站时，密码就会从 cookie 中取回。

### 日期 cookie

当访问者首次访问你的网站时，当前的日期可存储于 cookie 中。当他们再次访问网站时，他们会收到类似这样的一条消息："Your last visit was on Tuesday August 11, 2005!"。日期也是从 cookie 中取回的。


cookie大小只有4kb左右，而且有有效期，过了有效期就会被删除。

## 与webstorage具体区别

- cookie数据始终在同源的http请求中携带（即使不需要），即cookie在浏览器和服务器间来回传递。
- sessionStorage和localStorage不会自动把数据发给服务器，仅在本地保存。
- cookie数据还有路径（path）的概念，可以限制cookie只属于某个路径下。
- 存储大小限制也不同，cookie数据不能超过4k，同时因为每次http请求都会携带cookie，所以cookie只适合保存很小的数据，如会话标识。
- sessionStorage和localStorage 虽然也有存储大小的限制，但比cookie大得多，可以达到5M或更大。
- 数据有效期不同，sessionStorage：仅在当前浏览器窗口关闭前有效，自然也就不可能持久保持；localStorage：始终有效，窗口或浏览器关闭也一直保存，因此用作持久数据；
- cookie只在设置的cookie过期时间之前一直有效，即使窗口或浏览器关闭。
- 作用域不同，sessionStorage不在不同的浏览器窗口中共享，即使是同一个页面；

localStorage 在所有同源窗口中都是共享的；cookie也是在所有同源窗口中都是共享的。Web Storage 支持事件通知机制，可以将数据更新的通知发送给监听者。Web Storage 的 api 接口使用更方便。

OK，那个关于cookie和storage的相关知识就总结到这，希望大家能有所收获。晚安！！