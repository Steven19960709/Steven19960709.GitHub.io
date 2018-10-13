---
layout: post
title: vue Live note
date: 2018-10-13
tags: [vue]
---

### 组件化

从页面到应用的改变。

应用抽象为组件树，更偏向展示层。react的变革为一个组件可以调用其它的函数。react里面组件最简单的写法就是要给函数，可以返回virtual dom，props。突破了原来的静态的理解方式。默认的组件形式是state。

组件实际应用：

- 纯展示型组件：以markup为主，数据进出。
- 接入型组件：跟数据层的service 层打交道。（container component）
- 交互性组件：典型的，就是对表单组件的封装。可能会有比较复杂的逻辑，主要强调服用。
- 功能性组件：例如路由组件，主要是逻辑的处理本身不渲染任何内容。本身作为一种抽象类型的存在。作为一种扩展、抽象机制存在。

另外一个概念就是，vue的组织形式，style，template都是放在一个文件中。

### 变化侦测和渲染机制

现代的渲染机制主要两种：声明式和命名式的两种形式（vue&&jquery）。

命名式如jQuery的形式，不好维护，当代码很多的时候。声明式是绑定好关系，不需要做别的操作。

    view = render(state) // 一个输入，一个输出。底层可以是virtual Dom，也可能是比较细粒度的绑定。

渲染机制：virtual dom可以有很多种实现方式。在Github上可以看到相关内容。

变化侦测：vue是响应式的。

    <div onclick="clickHandler"></div>

在vue中，这样的声明式写法主要区别在于作用域。

变化侦测主要两种方式：pull和push。react里面的setState主要是virtualDom里面的diff。Angular是脏检查。

push就是vue的响应式的。在数据变动之后，马上就能知道什么数据变了，粒度非常小。pull这种形式的画就非常粗了，可以跳过这样的shouldComponentUpdate这样的暴力检查，又如，pureComponent这样的。但是如果太多的observe也不例如页面的开发，增大压力。

在vue2里，组件内部使用virtual Dom。组件级别就是一个watcher。这样就是一个折中的策略。也可以说是混合式的策略。

这篇内容就先介绍到这里。

