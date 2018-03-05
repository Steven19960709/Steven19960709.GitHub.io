---
layout: post
title: 知识总结2018.3.5
date: 2018-03-05
tags: [other]
---

## iterator 

Iterator迭代器，以前通常使用的是for循环，但是这样的for循环如果存在多层嵌套的话，代码会显得特别复杂。因此，Iterator可以解决这个问题。

Iterator是一特殊的对象。它主要是利用next来进行遍历的。每一次调用next方法，都会返回一个result对象，里面有两个字段，done和value，done表示是否遍历完成，而value则是表示此次返回的值。

我们使用ES5来进行Iterator的模仿。

    function createIterator(item) {
        var i = 0;
        return {
            next: function () {
                var done = (i >= item.length);
                var value = !done ? items[i++] : undefined;
                return {
                    done,
                    value
                }
            }
        }
    }

## Generator

Generator是一个返回迭代器的函数（生成器），通过function关键字后面的‘*’号来表示，函数中需要用到yield关键字。这里需要注意的是yield也是只能在generator函数中使用。不能嵌套在普通函数里面。

可以这样来建立一个生成器函数：

    let o = {
        createIterator: function * (item) {
            for (let i = 0; i < items.length; i++) }
            yield items[i];
        }
    }//这是通过ES5的对象字面量来创建的

    let o = {
        * createIterator(itmes) {
            for (let i = 0; i < items.length; i++) {
                yield items[i];
            }
        }
    }

## for...of

这个循环是利用Symbol.Iterator来实现的。即，如果遍历对象具有这个接口才能被遍历到，否则不行。例如数组，字符串，Map，Set就是可迭代的对象，但是普通的对象就是不可迭代的。但是如果是手动的加上一个Symbol.iterator就可以实现可迭代的。

    let collection = {
        items: [],
        *[Symbol.iterator]() {
            for (let item of this.items) {
                yield item;
            }
        }
    }

还有几个对应的迭代方式：entries(),keys(),values()

entries(): 返回遍历对象中的建和值

    let color = [red, blue, keys];
    for (let entry of color.entries()) {
        console.log(entry); // [0, 'red'], [1, 'blue'], [2, 'keys']
    }

values(): 返回值

keys(): 返回键

不同的数据结构，在使用for...of的时候，如果没有显示的指定使用那种方法，那么它会使用默认的遍历方法。数组和set集合默认的是values()方法，Map集合的默认迭代器是entries()方法。

    let colors = ['red', 'blue', 'green'];
    let tracking = new Set([1234, 5678, 9012]);
    let data = new Map();

    data.set('title', 'understanding ecmascrit 6');
    data.set('format', 'pring');
    //与调用colors.values()方法相同
    for (let value of colors) {
        console.log(value);
    }// red blue green
    //与调用tracking.values()方法相同
    for (let num of tracking) {
        console.log(num);
    }
    //与使用data.entries()方法相同
    for(let entry of data) {
        console.log(entry); // ['title', 'understanding ecmascript6], ['format', 'print']
    }

