---
layout: post
title: http headers
date: 2018-04-07
tags: [node]
---

这篇文章主要是讲一下关于http headers相关知识。


### request headers

先讲一下关于http请求头的东西。请求头中有这么几个字段：

- Accept：告诉服务器，客户端支持的数据（MIME）类型。常见的有以下这么几种：

    - application/xml Xml文本
    - text/html 超文本标记语言文本
    - text/plain 普通文本
    - image/png png图像
    - image/jpeg jpg图像
    - audio/basic au声音文件
    - video/x-msvideo AVI文件
    - application/x-gzip 压缩gzip文件

    // MIME类型有两部分组成，前面是数据的大类别，例如文本，图像，声音，后面定义具体种类。

- Cookie：客户端cookie就是通过这个报文头发送的
- Referer：表示这个报文头是从那个URL过来的
- Cache-Control：对缓存进行控制，如一个请求响应返回的内容在客户端需要被缓存一年。不需要缓存就这样：Cache-control: no-cache
- Accept-Charset：告诉服务器，客户端采用的编码。
- Host：客户机通过这个，告诉服务器想要访问的主机名
- Content-Length：表示请求消息的正文长度
- If-Modified-Since: 只有当所请求的内容在指定的日起之后又经过修改才返回它，否则返回304“not Modified”。
- User-Agent：客户机通过这个高速浏览器，客户机的软件环境
- connection: 客户机通过这个头告诉服务器，是关闭还是保持连接。

### response headers

- Location: 这个头是配合302状态码使用，告诉客户机找谁
- Server: 服务器通过这个告诉浏览器，服务器的类型
- Content-type: 服务器通过这个回送数据的类型
- Refresh：服务器通过这个字段，高速服务区当前资源的缓存时间
- ETag: 与缓存相关的字段，用于标识URL对象是否改变。
- Expires: 服务器通过这个头，告诉浏览器把会送的数据缓存多长时间，-1或0不缓存
- Connection: 服务器通过这个头，响应完事保持连接还是关闭连接。
- Date: 告诉客户机，返回响应的时间。

### ETag

客户端请求一个页面（A），并在给A加上一个ETag。客户端展现该页面，并将页面连同ETag一起缓存。客户端再次请求页面A，并将上次请求时服务器返回的ETag一起传递给服务器。服务器检查该ETag，并判断该页面自上次客户端请求之后是否还没被修改，是的话，直接返回响应304,和一个空的响应体。