---
layout: post
title: React的生命周期（概述）
date: 2018-01-26
tags: [React]
---

对于React组件，生命周期是核心观念之一。React的组件的生命周期分为挂载，渲染，卸载这几个阶段。当渲染后的组件需要更新的时候，会重新渲染组件，直至卸载。因此，将React生命周期分成两类：

- 组件在挂载或者是卸载时；
- 组件接收新的数据，即更新时。

### 挂载或卸载过程

组件挂载的时候推荐这样的写法：

    class App extends Component {
        static propTypes = {
            //....
        };
        static defaultProps = {
            //....
        };
        constructor(props) {
            super(props);
            this.state = {
                //..
            };
        }
        componentWillMount () {
            //...
        }// 已取消此方法
        getDerivedStateFromProps () {
            // 新增的生命周期
        }
        componentDidMount () {
            //...
        }
        render () {
            //...
        }
    }

显然易见的<span><del>componentWillMount</del></span>(该生命周期函数已取消)会在render方法之前执行，而ComponentDidMount会在render执行之后执行。这里要注意的是，如果在componentWillMount里面使用setState的话是一次无意义的操作，因为render的时候，会初始化state，所以可以直接在state里面设置初始化数据就可以了。

组件卸载的时候只有componentWillUnMount这一个卸载前的状态，通常会执行一些清理方法，如事件的回收或是清除定时器等。

### 组件更新过程 

更新过程指的是父组件向下传递props或者是组件自身执行setState方法时发生的一系列更新动作。

    class App extends Componentv{
        componentWillReceiveProps (nextProps) {
            //this.setState({})
        }
        shouldComponentUpdate(nextProps, nextState) {
            // return true;
        }
        componentWillUpdate(nextProps, nextState) {
            //..
        }
        componentDidUpdate(prveProps, prevState) {
            // ...
        }
        render () {
            return <div>this is somethings</div>
        }
    }

如果组件自身的state更新了，那么会依次执行shouldcomponentUpdate,componentWillUpdate,render 和ComponentDidUpdate。

shouldComponentUpdate是一个特别的方法，它接收需要更新的Props和State，让开发者增加必要的条件判断，让其在需要时更新，不需要是不更新。因此，当当方法返回false的时候组件不在向下执行生命周期的方法。

shouldComponentUpdate的本质是用来进行正确的组件渲染。考虑一个树状结构图，当父节点的props改变的嘶吼，在理想的情况下，只需要渲染在一条链路上相关props改变的节点即可。而默认的情况下，react是会把所有的节点重新渲染，因为shouldComponentUpdate默认返回的是true。因此，正确地使用shouldComponentUpdate，可以提高性能。但是要注意一点的是无状态组件没有生命周期方法，这也意味着他没有shouldComponentUpdate。渲染到该组件的时候，每次都会重新渲染。

componentWillUpdate和componentDidUpdate分别代表更新过程中渲染前后的时刻，前者会提供更新的props和state，而后者将是提供更新前的props和state。但是不能自componentWillUpdate中执行setState。

如果组建时有父组件更新Props而更新的，那么在shouldComponentUpdate之前会先执行componentWillReceiveProps方法。此方法可以作为React在props传入后，渲染之前setState的机会。

### 新增的生命周期

- getDerviedStateFromProps

一个静态方法，所以不能在这个函数里面使用this，这个函数有两个参数props和state，分别直接收到的新参数和当前的state对象，这个函数会返回一个对象用来更新当前的state对象，如果不需要更新可以返回null。

该函数会在挂载时，接受到新的Props，调用setState和forceUpdate时被调用。

    class ExampleComponent extends React.Component {
        state = {
            isScrollingDown: false,
            lastRow: null
        }
        static getDerivedStateFromProps(nextProps, prevState) {
            if (nextProps.currentRow !== prevState.lastRow) {
                return {
                    isScrollingDown: 
                        nextProps.currentRow > prevState.lastRow,
                        lastRow: nextProps.currentRow
                }
            }
            return null;
        }
    }

- getSnapshorBeforeUpdate

这个方法在render之后，componentDidMount之前调用，有两个参数prevProps和prevState，表示之前对 属性和之前的state，这个函数有一个返回值，会作为第三个参数传给componentDidUpdate。

-------------------------------------------------------------------------

废弃的三个生命周期函数

- componentWillMount
- componentWillReceiveProps
- componentWillUpdate

