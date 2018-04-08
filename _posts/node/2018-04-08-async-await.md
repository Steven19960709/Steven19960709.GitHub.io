---
layout: post
title: async/await
date: 2018-04-08
tags: [ES7]
---

## async函数

ES2017引入了async函数，作为最后的不到终结了回调处理的问题。

async函数可以看做是自带执行期Generator函数，我们之间有形如下面的Generator方法：

    function * gen() {
        let result = yield readFile_promise("foo.txt");
        console.log(result);
        let result = yield readFile_promise("bar.txt");
        console.log(result2);
    }
    //use async function 
    let asyncReadFile = async function () {
        let result = await readFile("foo.txt");
        let result2 = await readFile("foo.txt");
        console.log(result.toString());
        console.log(result.toString());
    }

区别，yield关键字换成了await，方法名前面的*号变成了async关键字。在使用上的一个区别是await关键字，await关键字后面往往是一个Promise，如果不是就隐式调用promise.resolve来转换成一个Promise。Await的动作和它的名字含义相同，等待后面的Promise执行完成后在进行下一步操作。

另一个重要区别在于调用方式，调用一个async方法完全可以通过方法名来调用。例如：   

    asyncReadFile()

这样的方式没有回调，而且简洁。

### 声明一个async方法

    async function foo() {};
    const foo = async function () {};
    const foo = async () => {};

#### async 返回值

async函数总是会返回一个Promise对象，如果return关键字后面不是一个Promise，那么默认调用promise.resolve方法进行转换。

    async function asyncFunc() {
        return "hello Node";
    }
    asyncFun ().then((data) => {
        console.log(data); // hello node
    })

#### async 函数的执行过程

1. 在async函数执行的时候，会自动生成一个Promise对象
2. 当方法体开始执行后，如果遇到return关键字或者throw关键字，执行会立刻退出，如果遇到await关键字则会暂停执行
3. 执行完毕，返回一个Promise

        async function asyncFunc() {
            console.log("begin");
            return "hello";
        }
        asyncFunc().
        then(x => console.log(x));
        consoe.log("end");
        // begin 
        //end
        //hello
    
async返回的promise既可以是resolve状态，也可以是reject状态，不过通常使用throw Error的方式来代替reject。

#### await 关键字

对于async函数来说，await关键字不是必须的，由于async本质上是对Promise的封装，那么可以使用执行Promise的方法来执行一个async方法。而await关键字则是对这一情况的语法糖，它可以自动执行一个Promise（本质上是等待后面的Promise完成后在进行下一个动作），当async函数内有多个Promise需要串行执行的时候，这种特性带来很多优点。

