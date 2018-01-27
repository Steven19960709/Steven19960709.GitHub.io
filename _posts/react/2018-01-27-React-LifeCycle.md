---
layout: post
title: React生命周期管理艺术
date: 2018-01-27
tags: [React]
---

React的主要思想是通过构建可服用组件来构建用户界面。 所谓组件其实就是有限状态机（ FSM）， 通过状态渲染对应的界面， 而且每个组间都有自己的生命周期。

有限状态机， 表示有限个状态以及在这些状态之间的转移和动作等行为的模型。 一般通过状态， 事件， 转换和动作等来描述有限状态机。 状态机能够记住目前所处的状态， 可以根据当前的状态做出相应的决策， 并且可以进入不同状态的时候做不同的操作。 状态机将复杂的关系简单化， 利用这种自然而直观的方式可以让代码更容易理解。React就是利用这一个概念，通过管理状态来实现对组件的管理。同时，react还引入了组件的生命周期这个概念，可以实现组件的状态仅控制，从而达到“生命周期-状态-组件”和谐一统。

以下是组件的生命周期在不同状态下的执行顺序：

- 当首次挂载组件的时候，依次执行getDefaultProps，getInitialState，componentWillMount，render和componentDidMount。

- 当卸载组件的时候，执行componentWillUnmount。

- 当重新挂在组件的时候，依次执行，getInitialState，componentWillMount，render和componentDidMount，但并不执行getDefaultProps。

- 当再次渲染组件是，组件接收到更新的状态，此时按照顺序执行componentWillReceiveProps，shouldComponentUpdate，componentWillUpdate，render和componentDidupdate。

当使用ES6 class 构建组件是，static defaultProps等价于调用内部的getDefaultProps方法，constructor中的this.state = {}其实就是调用内部的getInitialState方法。

## 详解生命周期

### 使用createClass创建自定义组件

先说明一点，目前createClass创建组件的接口已经不对外开放，可以使用function来创建无状态组件，或者使用class编写react组件。

当使用ES6 class 编写组件的是偶，会调用内部的createClass方法创建组件。

    let ReactClass = {
        createClass: function (spec) {
            var Constructor = function (props, context, updater) {
                if (this._reactAutoBindPairs.length) {
                    bindAutoBindMethods(this);
                }
                this.props = props;
                this.context = context;
                this.refs = emptyObject;
                this.update = updater || ReactNoopUpdateQueue;
                this.state = null
            };
            // 原型继承父类
            Constructor.prototype = new ReactClassComponent();
            Constructor.prototype.constructor = Constructor;
            Constructor.prototype__reactAutoBindPairs = [];
            //..............
            return Constructor;
        }
    }

### 阶段一: Mounting

mountComponent负责管理生命周期中的getInitialState，componentWillMount，render和componentDidMount。

由于getDefaultProps是通过构造函数进行管理的，所以也是整个生命周期中最先开始执行的。而mountComponent无法调用getDefaultProps，所以getDefaultProps只执行一次。

通过mountComponent挂载组件，初始化序号，标记等参数，判断是否为无状态组件，并进行对应的组件初始化工作，比如初始化props，context等参数。利用getInitialState获取初始化state，初始化更新队列和更新状态。

若存在componentWillMount，则执行。如果此时再componentWillMount中调用setState是不会进行re-render的，而是会进行state合并，且inst.state = this._processPendingState是在componentWillMount之后执行的，因此，componentWillMount中的this.state不是最新的，在render中才可以获取更新后的this.state。

因此，react是利用更新队列this.-pndingStateQueue 以及更新状态this.-pendingReplaceStaet和this._pendingForceUpdate来实现setState的异步更新机制。

当渲染完成之后，若存在componentDidMount，则调用。

本质上，mountComponent是通过递归来渲染内容的。

### 阶段二，RECEIVE_PROPS

updateComponent负责管理生命周期中的componentWillReceiveProps、shouldComponentUpdateUpdate、componentWillUpdate，render和componentDidUpdate。

首先通过updateComponent更新组件，如果前后元素不一致，说明需要进行组件更新。若存在componentWillReceiveProps，则执行，如果此时再里面调用setState，是不会触发re-render的，会进行state合并。

调用shouldComponentUpdate来判断是否需要进行组件更新，如果存在componentWillUpdate，则执行。

### 阶段三，UNMOUNTING

负责管理生命周期中的componentWillUnmount。

如果存componentWillUnmount则执行并重置所有相关参数，跟新队列以及更新状态，如果此时再componentWillUnmount中调用setState，是不会触发re-render的。这是因为所有更新队列和更新状态都被重置为null，并清除了公共类，挖好吃呢个了组建的卸载操作。

讲到这，生命周期大概内容就讲完了，但是省略了很多内容，有兴趣的可以课下了解一下。

希望大家能有所收获！加油！！