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

    async function readFile() {
        let result = await readfile_promise("foo.txt");// 代码1
        console.log(result); 
    }
    readFile();
    // 等价于
    readFile_promise("foo.txt")
    .then((data) => {
        console.log(data);
    })

由于await可以看做是一个Promise的执行期，那么上面的代码1可以写成：

    let result = await readFile_promise("foo.txt").then((result) => {
        return result;
    })
    //等价于
    await new Promise((resolve, reject) => {
        resolve(result);
    })

await会等待后面的Promise动作完成后者在采取下一步动作，这意味着有多个await操作时，程序会完全变成串行操作。为了发挥异步优势，当异步操作之间不存在依赖关系，可以使用Promise.all来实现并行。

    //await and promise.all
    async function readFile() {
        const [result1, result2] = await Promise.all([
            readFile_promise("foo.txt"),
            readFile_promise("bar.txt")
        ])；
        console.log(result1, result2);
    }
    //等价于
    function readFile() {
        return Promise.all([
            readFile_promise("foo.txt"),
            readFile_promise("bar.txt")
        ]).then((result) => {
            console.log(reslt);
        })
    }

### 错误处理

当async函数中有多个await关键字是，如果有一个await状态变成rejected。那么后面的操作将不会继续执行。

    let asyncReadFile = async function () {
        let result1 = await readFile(soe path not exist);
        let result2 = await readFile('bar.txt');
        console.log(reeslt1.toString());
        console.log(result2.toString());
    }

当如果有没有被处理的rejected状态的Promise，控制台就会打印出相关信息，所以我们需要使用try....catch语句。

    let asyncReadFile = async function () {
        try{
            let result1 = await readFile(some path not exitst);
            let result2 = await readFile ('bar.txt');

        }
        catch (e) {
            console.log(error occurred);
        }
    }

### 在循环中使用async方法

1. for/while循环

    let array = ["foo.txt", "bar.txt","baz/txt"]
    async function readFile() {
        for (let i = 0; i < 3; i++) {
            let result = await readFile_promise(array][i]);
            console.log(result);
        }
    }

2. forEach循环

    async function readFile(list) {
        list.forEach (async (item) => {
            let result = await readFile_promise(item) ;
            console.log(result);
        })
    }

3. for....of循环

    async function readFile(list) {
        for (var item of list) {
            let result = await readFile_promise(item);
            console.log(result);
        }
    }
    readfile(["foo.txt", "bar.txt", "baz.txt"]);

另一方面，如果异步方法的执行全部变成串行的话，就不能发挥出node非阻塞IO的优势，如果想使用并行来提高效率，就需要使用promise.all()。

    async function readFile(list) {
        await Promise.all(list.map(async (item) => {
            let result = await readFile_promise(item);
            console.log(result);
        }))
    }
    readFile(["foo.txt", "bar.txt", "baz.txt"]);

#### to sum up

async函数是用async和await关键字来标识的，async返回一个Promise对象，当在方法体内遇到异步操作的时候，立刻返回，随后不断轮询知道一步操作完成，随后在继续执行剩下的代码。

    async function timeout(ms) {
        await new Promise(resolve) => {
            settimeout(resolve, ms);
        }
    }
    asynca function (asyncPrint(ms) {
        for (let i = 0; i<5; i++) {
            await timeout (ms);
            console.log(i)
        }
    })
    asyncPrint(1000);
    每隔一秒输出0,1,2,3,4,

await关键字必须位于async函数内部，必须要一个promise对象，返回结果就是其后面的Promise执行结果，不能再普通箭头函数中使用await，需要async关键字；使用爱wait串行异步操作，想实现并行考虑promise.all。

