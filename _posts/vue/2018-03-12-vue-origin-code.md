---
layout: post
title: vue Origin Code
date: 2018-03-12
tags: [vue]
---

目前集中mvvm框架都是实现单向数据绑定，实现数据绑定的做法通常是有这么几种：

- 发布订阅者模式
- 脏值检查
- 数据劫持

其中发布订阅者就不说了，脏值检查就是通过检测数据是否变更来决定是否更新视图，最简单的方式就是用过定时器，定时伦旭监测数据变动，Augular只有在指定事件触发时才会进入脏值检测，大致如下：

- DOM事件，譬如用户输入文本，点击按钮等。
- XHR响应事件
- 浏览器Location变更事件
- timer事件
- 执行$digest（）或者$apply()

数据劫持结合发布订阅者模式是vue的实现方式，通过Object.defineProperty()来劫持各个属性的setter，getter在数据变动时发布消息给订阅者，触发相应的监听回调。

## 思路

<img src='https://segmentfault.com/img/bVBQYu/view'>

实现MVVM的双向绑定，就必须实现以下几点：

- 实现一个数据监听器Observer，能够对数据对象的所有数据进行监听，如有变动可以拿到最新值并通知订阅者
- 实现一个Compile，对每个元素节点的指令进行扫描和解析，根据指令模版替换数据，以及绑定相应更新函数
- 实现一个Watcher，作为连接Observer和Compile的桥梁，能够订阅并收到每个属性变动的通知，执行指令绑定的相应回调函数，从而更新视图。
- mvvm入口函数，整合以上三者。

### 实现Observer

核心就是之前说的Object.defineProperty()来监听属性的变动，那么将需要观察的数据对象进行递归遍历，包括自属性对象的属性，都加上setter和getter，那么当个这个数据添加某个值的时候，就会触发setter，那么就能监听到了数据变化。

    function observe(data) {
        if (!data || typeof data !== 'object') {
            return;
        }
        //take all property 
        Object.keys(data).forEach(function (key) {
            //Object.keys({month: '12', year: '2018'}) --> ['month', 'year']
            defineReactive(data, key, data[key]);
        })
    }
    function defineReactive(data, key, val) {
        observe(val) //监听子属性
        Object.defineProperty(data, key, {
            enumerable: true, //可枚举
            configurable: false, //不能在define
            get: function () {
                return val;
            }
            set: function (newVal) {
                console.log('is changing now', val, '--->', newVal);
                val = newVal;
            }
        })
       
    }

这样就可以监听每个数据的变化了，这个时候我们还要实现数据变化后通知订阅者，称为消息订阅器，基本思路是维护一个数组，用来收集订阅者，数据变动触发notify，在调用订阅者update方法，代码改善之后是这样：

        function deineReactive(data, key, vl) {
            var dep = new Dep();
            observe(val);
            Object.defineProperty(data, key, {
                set: function (newVal) {
                    if (val === newVal) {
                        return;
                    }
                    console.log('is changing now', val, '--->', newVal);
                    val = newVal;
                    dep.notify(); //通知所有订阅者
                },
            
            });
        }
        function Dep() {
            this.subs = [];
        }
        Dep.prototype = {
            addSub: function (sub) {
                this.subs.push(sub);
            }
            notify:: function (sub) {
                this.subs.forEach(function (sub) {
                    sub.update();
                })
            }
        }

然后我们就需要解决订阅者这部分的代码，往订阅器里面添加订阅者。这个时候，我们需要在defineReactive方法内部定义的，想通过dep添加订阅者，就必须在闭包内操作。需要在getter里面动手脚: 

    Object.defineProperty(data, key, {
        get: function () {
            Dep.target && dep.addDep(Dep.target);
            return val;
        }
        // ...省略
    })

    Watcher.prototype = {
        get: function () {
            Dep.target = this;
            this.value = data[key]; //触发getter，从而添加订阅者
            Dep.target = null;
        }
    }

### 实现compile

<img src='https://segmentfault.com/img/bVBQY3/view'>

compile主要做的事情是解析模版指令，讲模版中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图。

    function Compile(el) {
        this.$el = thisisElementNode(el) ? el : document.querySelector(el);
        if (this.$el) {
            this.$fragment = this.node2Fragment(this.$el);
            this.init();
            this.$el.appendChild(this.$fragment);
        }
    }
    Compile.prototype = {
        init: function() {
            this.compileElement(this.$fragment);
        },
        node2Fragment: function(el) {
            var fragment = document.createDocumentFragment(), child;
            //将原生节点拷贝到fragment
            while (child = el.firstChild) {
                fragment.appendChild(child);
            }
            return fragment;
        }
    };

    compileElement方法将遍历所有节点及其子节点，进行扫描解析编译，调用对应的指令渲染函数进行数据渲染，并调用对应的指令跟新函数进行绑定

        Compile.prototype = {
            compileElement: function (el) {
                var childNodes = el.chilNodes;
                var me = this;
                [].slice.call(childNodes).forEach(fucntion(node) {
                    var tet = node.textContent;
                    var reg = /\{\{(.*)\}\}/;//表达式文本
                    //暗元素节点方式编译
                    if (me.isElementNode(node)) {
                        me.compile(node);
                    } else if (me.isTextNode(node) && reg.test(text)) {
                        me.compileText(node, RegExp.$1);
                    }
                    //遍历编译子节点
                    if (ndoe.childNodes && node.childNodes.length) {
                        me.compileElement(node);
                    }
                })
            },
            compile: function(node) {
                var nodeAttrs = node.attributes, me = this;
                [].slice.call(nodeAttrs).forEach(fucntion(attr) {
                    //规定：指令以v-xxx方式命名
                    //例如：<span v-text='content'>
                    var attrName = attr.name;
                    if (me.isDirective(attrName)) {
                        var exp = attr.value;//content
                        var dir = attrName.substring(2); // text
                        if (me.isEventDirective(dir)) {
                            //事件指令，如v-on:click
                            compileUtil.eventHandler(node, me.$v, exp);
                        }
                    }
                })

            }
        }
        //指令处理集
        var compileUtil = {
            text: function(node, vm, exp) {
                this.bind(node, vm, exp, 'text');
            },
            //......
            bind: function (node, vm, exp, dir) {
                var updaterFn = updater[dir + 'updater'];
                //第一次初始化视图
                updaterFn && updateFn(node, vm[exp]);
                //实例化订阅者，此操作会在对应的属性消息订阅其中添加该订阅者wathcer，
                new Watcher(vm, exp, function (value, oldValue) {
                    //一点属性有变化，会收到通知执行此更新函数，更新视图
                    updaterFn && updaterFn(node, value, oldValue);
                })
                
            }
        }
        var updater = {
            textUpdater: function (node,value) {
                node.textContent = typeof value == 'undefined' ? '' : value;
            }
            // ... 省略
        }

这里通过递归遍历保证了每个节点及子节点都会解析编译到，包括了{{}}表达式声明的文本节点。指令的声明规定是通过特定前缀的节点属性来标记，如例子中的v-text指令，而模特让他突然不是指令而是普通属性。

监听数据，绑定更新函数的处理器在compileUtil.bind()方法中，通过new Watcher()添加回调接收数据变化的通知

### 实现 Watcher

Watcher订阅者作为Observer和Compile之间通信的桥梁，主要做的事情是：

- 在自身实例化失望属性订阅器添加自己
- 自身必须有一个update()方法
- 待属性变动dep.notify()通知是，能调用自身的update()方法，并触发Compile中绑定的回调

    function Watcher (vm, exp, cb) {
        this.cb = cb;
        this.vm = vm;
        this.exp = exp;
        //此处为了触发属性的getter，从而在dep添加自己，结合Observer理解
        this.value = this.get();
    }
    Watcher.prototype = {
        update: function () {
            this.run();//属性值变化收到通知
        },
        run: function () {
            var value = this.get();
            var oldVal = this.value;
            if (value !== oldVal) {
                this.value = value;
                this.cb.call (this.vm, value, oldVal); //执行Compile中绑定的回调，更新视图
            }
        },
        get: function () {
            Dep.target = this; //将当前订阅者指向自己
            var value = this.vm[exp]; //触发getter，添加自己到属性订阅器中
            Dep.target = null; //添加完毕，重置
            return value;
        }
    }

实例化Watcher的时候，调用get()方法，通过Dep.target = watcherInstance标记订阅者是当前watcher实例，强行触发属性定义的getter方法，getter方法执行的时候，就会在属性的订阅器dep添加当前watcher实例，从而在属性有变化时，watcherinstance就能收到通知。

### 实现MVVM 整合

整合Observer，Compile，Watcher三者，通过Observer来监听自己的model数据变化，通过compile解析编译模版指令，最终使用watcher大气Observer和compile之间的通信桥梁，达到数据变化--视图更新--视图交互--数据model变更

    function MvvM (options) {
        this.$options = options;
        var data = this._data = this.$options.data, me = this;
        Object.keys(data).forEach(function (key) {
            me._proxy(key);
        });
        observe(data, this);
        this.$compile = new Compile(options.el || document.body, this)
    }
    MvvM.prototype = {
        _proxy: function (key) {
            var me = this;
            Object.defineProperty(me, key, {
                configurable: false,
                enumerable: true,
                get: function proxyGetter() {
                    return me._data[key];
                },
                set: function proxySetter(newVal) {
                    me._data[key] = newVal;
                }
            })
        }
    }

完成这个双向绑定了。

本文参考:   [剖析Vue原理&实现双向绑定MVVM](https://segmentfault.com/a/1190000006599500)