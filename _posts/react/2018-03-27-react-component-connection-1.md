---
layout: post
title: React组件间通信
date: 2018-03-27
tags: [React]
---

关于React组件间通讯，面试经常被问到，现在做个总结。

## 通讯关系

首先，在React中有这么几个层级关系，即父子通信，兄弟通信。以下实现这两种通信方式。

### 父组件向子组件通信

首先，react通信是单向的，数据必须是由一方传到另一方。父组件向子组件通信可以通过props的方式向子组件通信。

    class GrandFather extends Component {
        state = {
            msg: 'start'
        }
        componentDidMount () {
            setTimeout(() => {
                this.setState({
                    msg: 'end'
                });
            }, 1000);
        }
        render () {
            return <Son msg={this.state.msg} />
        }
    }
    class Father extends Component {
        render() {
            return <p>{this.props.msg}</p>
        }
    }

如果父组件与子组件之间不止一个层级，类似关系如爷爷与孙子的关系，那么可以使用'...'运算符。 

    class Father extends Component {
        render() {
            return <div>
                <p>{this.props.msg}</p>
                <Child/>
                </div>
        }
    }
    class Son extends Component{
        render() {
            return <p>{this.props.msgs}</p>
        }
    }

### 子组件向父组件通讯

如果需要子组件向父组件通讯的话，那就会比较麻烦。不过同样需要父组件向子组件传递props，不同的是父组件传递的是作用于为父组件自身的函数，自组件调用该函数，将子组件想要传递信息，作为参数，传递到父组件的作用域中。

    class Father extends Component {
        state = {
            msg: 'start'
        }
        transferMsg(msg) {
            this.setState({
                msg
            });
        }
        render(){
            return (
                <div>
                    <p>child msg: {this.state.msg}</p>
                    <Son transferMsg = {msg => this.transferMsg(msg)}/>
                </div>
            )
        }
    }

    class Son extends Component {
        componentDidMount () {
            setTimeout(() => {
                this.props.transferMsg('end')
            }, 1000);
        }
        render() {
            return (
                <div>
                    <p>child components</p>
                </div>
            )
        }
    }

这个例子中，使用了箭头函数，将父组件的transferMsg函数通过props传递给子组件，得益于箭头函数，保证子组件在调用transferMsg函数时，内部this仍指向父组件。

### 兄弟组件通信

对于没有直接关联的两个节点，唯一的关联点是父节点，这样需要使用父组件来作为桥梁来进行通信。

    class Parent extends Component {
        state = {
            msg: 'start'
        }
        transferMsg (msg) {
            this.setState({
                msg
            })
        }
        render() {
            return (
                <div>
                    <Son1 msg={this.state.msg} transferMsg = {(msg) => this.transferMsg(msg)}/>
                    <Son2 msg={this.state.msg}/>
                </div>
            )
        }
    }
    class Son1 extends Component {
        componentDidMount() {
            this.props.transferMsg('end');
        }
        render() {
            return (
                <div>
                    <p>Son1</p>
                </div>
            )
        }
    }
    class Son2 extends Component {
        ComponentDidUpdate() {
            console.log('Son2 update')
        }
        render() {
            return(
                <div>{this.props.msg}</div>
            )
        }
    }

上面的就是兄弟之间的通信，但是有一个问题就是Parent的State发生变化，会触发Parent及从属与Parent的子组件的生命周期。

另外就是可以使用context这个API来进行获取，操作顺序是需要在父级中设定自己的propType，然后在子级中设定相应的propType。这个在React-redux里面的connect组件是这样写的:

    ...
    子组件中:
    class Button extends React.Component {
        render() {
            return (
                <button>
                    {this.props.children}
                </button>
            )
        }
    }
    Button.contextTypes = {
        color: PropTypes.string
    }
    //跨层组件 中间father级
    class Message extends React.Component {
        render() {
            return (
                <div>
                    {this.props.text}<Button>Delete</Button>
                </div>
            )
        }
    }
    //父组件中 （爷爷组件）
    class MessageList extends React.Component {
        getChildContext() {
            return {
                color: "red"
            }
        }
        render() {
            return( <Message text={message.text}/>)
        }
    }
    MessageList.ChildContextTypes = {
        color: PropTypes.string 
    }


## 观察者模式

传统的前端，观察者模式是比较常用的一种解耦设计模式。这里再实现一次吧。。。

    const eventProxy = {
        onObj: {},
        oneObj: {},
        on: function (key, fn) {//订阅相关事件
            if (this.onObj[key] === undefined) {//监听对象中如果不存在，则创建一个空数组
                this.onObj[key] = [];
            }
            this.onObj[key].push(fn);
        },
        one: function (key, fn) {
            if(this.oneObj[key] === undefined) {
                this.oneObj[key] = [];
            }
            this.oneObj[key].push(fn);
        },
        off: function (key) {
            this.onObj[key] = [];
            this.oneObj[key] = [];
        },
        trigger: function () {
            let key, args;
            if(arguments.length == 0) {
                return false;
            }
            key = arguments[0];
            args = [].concat(Array.prototype.slice.call(arguments, i));
            if (this.onObj[key] !== undefined && this.onObj[key].length > 0) {
                for (let i in this.onObj[key]) {
                    this.onObj[key][i].apply(null, args);
                }
                if (this.oneObj[key].length > 0) {
                    for (let i in this.oneObj[key] ) {
                        this.oneObj[key][i].apply(null, args);
                        this.oneObj[key][i] = undefined;
                    }
                    this.oneObj[key] = [];
                }
            }
        }

    }

