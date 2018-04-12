---
layout: post
title: Service Worker
date: 2018-04-12
tags: [share]
---

是独立于当前页面的一段运行在浏览器后台进程的脚本。Service worker不需要用户打开Web页面，也不需要其它交互，异步地运行在一个完全独立的上下文环境，不会对主线程造成阻塞。基于service worker可以实现消息推送。

service worker提供一种渐进增强的特性。使用特性检测来渐渐增强，不会在老旧的不支持sw的浏览器中产生影响。可以通过service workers解决让应用程序能够离线工作，让存储数据在离线时使用的问题。

### 特点

- service worker运行在它们自己的完全独立的异步的全局上下文中，也就是说它们有自己的容器。
- service worker没有直接操作DOM的权限，但是可以通过postMessage方法来与Web页面进行通信，让页面操作DOM。
- service worker是一个可编程的网络代理，允许开发者控制页面上处理的网络请求。
- 浏览器可能随时回收service worker，在不被使用的时候，它会自己终止，当它再次被用到的时候，会被重新激活。
- service worker的生命周期是由事件驱动的，而不是通过client。

## Service Worker的作用

1. 网络代理，转发请求，伪造响应

2. 离线缓存

3. 消息推送

4. 后台消息传递

## Service Worker生命周期

### 安装

要安装Service Worker，我们需要在页面上注册它，这个步骤是告诉浏览器，Service Worker脚本放在那里

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js").then((register) => {
            console.log(ServiceWorker registration successful with scope:", registration.scope);
        }).catch( (err) => {
            console.log("service Worker regisertation failed:", err);
        })
    }

这样就可以注册一个SW，成功之后，就可以打开Chrome://serviceworker-internals/。。。来查看浏览器的Service worker信息。

要注意的是，Service Worker文件的路径问题，上面的sw.js存放在网站的根路径下，这样的话，就表示该Service Worker将会收到该网站的所有fetch事件，如果将ServiceWorker文件注册为："/example/sw.js"，就表示sw将只会收到example路径下的fetch事件。

    sw.js
    const CACHE_NAME = "my_cache";
    let urlToCache = [
        "/index.html",
        "/css/style.css",
        "/js/script.js"
    ];
    // 这里的self指的是ServieWorkerGlobalScope
    self.addEventListener("install", (event) => {
        //这里的waitUtil会在安装成功之前执行一些预装的操作，但是只建议做一些轻量级和非常重要资源的缓存，减少安装失败的概率。安装成功
        // 后ServiceWorker状态会从installing变为installed
        event.waitUntil(
            caches.open(CACHE_NAME).then((cache) => {
                console.log("Opendhe", cache);
                return cache.addAll(urlsToCache);
            })
        )
    })

CAHCE_NAME代表这个缓存的名字，urlToCache代表初次缓存的文件。

上面的代码中，我们通过caches.open打开我们指定的cache文件名，然后我们调用cache.addAll并传入我们的文件数组。这是通过一连串的promise（caches.open和caches.addAll）完成的event.waitUntil拿到一个promise的状态来获取安装是否成功，如果所有文件都被缓存成功，那么ServiceWorker就安装成功了。如果任何一个文件下载安装失败，那么整个ServiceWorker的安装就失败，那么整个ServiceWorker安装就失败。这意味着我们需要非常谨慎地决定那些文件需要在安装步骤被缓存，制定太多文件额话就会增加整个ServiceWorker 应用安装失败的概率。

2. 利用ServiceWorker监听网络请求（伪造响应或增加缓存文件）

3. 销毁

    是否销毁有浏览器决定，如果一个Service Worker长期不使用或者机器内存有限，则浏览器就会销毁这个ServiceWorker。

4. 利用SW监听网络请求

当ServiceWorker 被安装成功并且用户浏览了另一个页面，ServiceWorker即开始接收fetch事件。

    self.addEventListener("fetch", (e) => {
        event.responseWidth(
            caches.match(event.request)
            .then((response) => {
                if (response) {
                    return reponse;
                }
                return fetch(event.request);
            })
        )
    });

上面的代码里我们监听了fetch事件，在event.resposneWith里我们传入一个有caches.match产生的promise.caches.match查找request中诶ServiceWorker缓存命中response。如果我们有一个命令的response，我们返回被缓存的值，否则我们返回一个实时从网络的结果。

如果我们想要增量地缓存新的请求，我们可以处理fetch请求的response并且添加它们到缓存中来实现，例如： 

    self.addEventListener("fetch", (event) => {
        event.responseWith(
            caches.match(event.request)
            .then((reponse) => {
                if (response) {
                    return resposne;
                }
                var fetchRequest = event.request.clone();
                return fetch(fetchRequest).then(
                    (response) => {
                        if (!response || response.status !== 200 || !response.headers.get("Content-Type").match(/image/)) {
                            return response;
                        }
                        var responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                        return response;
                    }
                )
            })
        )
    })

s首先检查缓存中是否已经缓存了这个请求，如果是，则直接返回响应，这样就减少了一次网络请求，否则有ServiceWorker发起请求，这使得ServiceWorker起到一个中间代理的作用。

ServiceWorker请求的过程通过fetch API完成，得到的response对象之后进行过滤，查看是否有图片文件，如果不是，则直接返回请求，不会缓存，如果是图片文件，要先复制一份response，原因是request或者response对象属于stream，只能使用一次，之后一份存入缓存，另一份发送到页面。这就是SW的强大之处：拦截请求，伪造请求，这个过程中fetch API起到了很大作用。

### 与sw相关的事件

#### fetch事件：

在页面发起http/https请求时，sw可以通过fetch拦截请求，并且给出自己响应，w3c提供的fetch API可以取代ajax，与xmlhttprequest最大的不同就是fetch返回的是promise对象，可通过then方法进行连续调用，减少嵌套。

#### message 事件

页面和ServiceWorker质检可以通过PostMessage方法发送消息，发送的消息可以通过message事件接收到。这是一个双向的过程，页面可以发消息给Service Worker，Service Worker也可以发送消息给页面，由于这个特性，可以将Service Worker作为中间纽带，使得一个域名或者子域名下的多个页面自由通信页可以实现服务器消息推送的功能。
