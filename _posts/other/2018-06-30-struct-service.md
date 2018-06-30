---
layout: post
title: 本地服务器开发
date: 2018-06-30
tags: [project]
---

动态构建和Mock服务是本地开发服务器的主要功能。动态构建解决的问题是面向开发层面的，通过监听-修改-触发-构建的流程避免了源码的每次修改都要手动执行一次构建，便与开发的即时调试。Mock服务是面向前后端协作层面的，以提前约定好的规范为前提，通过本地服务容器提供Mock数据接口辅助前端逻辑的编写。

### 动态构建

动态构建，或者叫做动态编译，目的是节省人力，方便前端的开发和调试，本质原理是监听+触发。

Webpack-dev-server是官方提供的用于搭建本地开发环境的一个微型Nodejs服务框架，并且提供动态编译、HMR（热更新）等功能。但是如果需要Mock服务，就还需要一个express框架额中间件。Webpack-dev-middleware。

Webpack-dev-middleware是express框架的一个中间件，简单来说，中间件是在输入到输出过程中对内容进行加工从而输出预想的数据。W-d-m将webpack构建输出的文件存储在内存中。正常情况下，webpack构建产出的文件会存储在output配置项指定的硬盘目录中。w-d-m在此基础上建立了一个文件映射机制，每当匹配到一个webpack构建产出稳健的请求后便会将内存中与其相对应的数据返回给发起请求的客户端。由于是内存的文件系统，没有耗时的硬盘读写程序过程，数据的更新非常快。

### 启动监听

实现监听和触发动态编译功能需要从Webpack-dev-middleware的配置入手，与之相关的配置项有两个：

- lazy：是否开启惰性模式
- watchOptions：监听细节配置

这两个配置项是冲突的，watchOptions在lazy模式开启时无效。在lazy代表的惰性模式下，webpack不会监听原文件的任何修改行为，只有在接收到客户端请求时才会重新编译。也就是说，惰性模式下的动态编译是由客户端请求触发的，webpack被动执行。

默认情况下Webpack-dev-middleware启用的是监听模式（lazy：false），主动监听源文件并且在其有修改行为时触发重新编译。watchOptions包括以下子配置项：

- aggregateTimeout：指定webpack的执行频率，单位毫秒，告知webpack将在此段时间内针对源代码的所有修改都聚合到一次重新编译行为中。默认值为300ms。
- ignored：指定不参加监听的文件，比如/node_modules/。此配置项会大幅降低CPU负荷和内存占用
- poll: 指定webpack监听无效时轮询校验的文件的频率，单位为毫秒。webpack Listener（文件系统事件监听），对于一些不支持Filesystem Event的场景（比如虚拟机）webpack针对此类场景的备选方案。如果开发环境支持Filesystem Event，将此配置设置为false。

### 静态资源服务

实际开发项目中并非所有的静态文件都参与构建，一些常用的第三方库通常使用单独的script和link标签引入，例如jQuery，bootstrap等。这些文件不参与构建，不在webpack-dev-middleware的监听范围之内，也就不能够通过文件映射策略将其对应的请求映射到内存文件系统中。只能借助于Express内置的static中间件将这些文件作为静态内容开发给HTTP服务。

    const Express = require('express');
    const WewbpackDevMiddleware = require('webpack-dev-middleware');
    const App = new Express()
    App.use(WebpackDevMiddleware(<compiler>));
    const Webpack = require('webpack');
    const Compiler = Webpack(<WebpackConfig>);
    App.use('/static', Express.static(Pathjoin(process.cwd(), 'static')))
        .use(WebpackDevMiddleware(compler,P
        lazy: false,
        watchOptions: {
            aggregateTimeout: 300,
            ignored: '/node_modules',
            poll: false,
        }))
    App.listen(8080, (err) => {
        if (err) {
            throw new Error(err)
        }
    })

上面就是本地服务器的一个具体例子。

那么，现在有个问题就是，浏览器在源码改动之后什么时候需要重新编译资源呢？

业界通用做法是在动态编译完成之后，立即触发浏览器的自动刷新，从而让浏览器及时获取重新编译之后的资源，这种方案称为Livereload。而webpack使用了一种更加高效且有利于调试的解决方案：Hot Module Replacement，简称HMR。

#### Livereload 和 HMR

Livereload的原理是在浏览器和服务器之间创建一个Websocket连接，服务端在执行完的动态编译之后发送reload事件到浏览器，浏览器接收到此时间之后刷新整个页面，具体流程如下图

<img src="http://ovk2ylefr.bkt.clouddn.com/prgress.png">

Livereload虽然能够保证动态构建的资源被浏览器即时获取，但是它有一个致命的缺陷：无法保存页面状态。举个例子，当我们调试CSS的时候，在浏览器中调试的代码，由于某些原因或者遗漏了某个字段，或者其他原因，以至于保存源文件之后触发Livereload。页面刷新之后由于源文件缺少了某个字段，导致UI乱作一团。

这种错误严重影响工作效率，因为浏览器调试面板的代码是临时性的，页面刷新之后被清空，而是由于开发人员马虎大意，导致出现低级失误。

之所以建立前段工程体系，便是在开发阶段允许一定的容错空间，在产出阶段对质量的严格把控。

HMR以拒不更新取代整体页面刷新，有效地弥补了Livereload无法保存页面状态的缺陷。

1.HMR工作流程

在开启webpack-dev-server模式下，webpack向构建输出的文件中注入了一项额外的功能模块——HMR Runtime。同时也服务器注入了对应的服务模块——HMR Server。两者是客户端与服务器端的关系，与Liverload的实现方式类似的是，两者之间也是通过websocket进行通信的。具体工作流程如下图：

<img src="http://ovk2ylefr.bkt.clouddn.com/progress.png">

- 修改源文件并保存后，webpack坚挺到Filesystem Event事件并触发重新构建行为。
- 构建完成之后，webpack将模块变动信息传递给HMR Server
- HMR Server通过WebSocket发送push信息告知HMR Runtime需要更新客户端模块，HMR Runtime随后通过HTTP获取更新模块的内容详情
- 最后，HMR Runtime将更新的模块进行替换，在此过程中浏览器不会进行刷新。

## Mock服务

这个Mock服务是前端最常使用的一个数据模拟的场景，即在上线之前，与后端的同学沟通好处理的接口，数据发送方式，数据格式之后，在本地创造出一个假数据，又或者，使用服务器代理的方法来获取数据。之后在进行渲染。

### SSR

根据项目需求，除了异步数据接口以外，Mock Server还需要兼顾SSR的场景。虽然目前市场大多数采用前后端分离开发的团队将HTML的渲染工作交给了客户端，但是依赖于SEO的产品依然难以避免使用服务器端渲染。

Mock Server 支持SSR的场景有以下两种：

- 页面初始输出的静态内容较多，使用HTML模板语言便于模块化开发和维护。
- 依靠服务端动态数据渲染初始页面。

对于第一种场景，使用HTML模板语法编写的文件只存在于源代码中，经过构建被编译为规范的HTML语法。所以这类似与处理SCSS与ES6.在webpack中配置对应的loader和plugin即可。

第二种场景，是常规意义上的SSR，也就是即时服务器端渲染，针对的是非前后端分离项目。MOCK server支持即时SSR前提是必须使用与服务器端相同的编程语言搭建。

## 总结

总的来说，本地开发服务器主要包括两个模块：动态构建和Mock服务。

动态构建主要目的是为了便于前端工程师在开发阶段的调试。有了Nodejs问价I/O权限支持，配合webpack局部更新机制，可以实现浏览器无刷新的即时调试。

Mock是支持后端分离和秉性开发的核心要素。Mock SErver的重要前提是将接口请求地址指向本地域名，之后在构建阶段中环境变量直接影响接口真实地址的赋值。

那么这部分的内容就先讲到这，希望大家能有所收获！