---
layout: post
title: 数组方法整理(ES3)
date: 2018-04-28
tags: [share, JavaScript]
---

今天主要是汇总一下所有数组的方法，包括ES2015的新方法。

所有方法都是亲测可信的。

### ES3

- concat: 连接两个或者更多的数组，并返回结果。不改变原数组。

    let originArray = [1, 2, 3, 4, 5];
    let newArray = [1,2,3];
    console.log(originArray.concat(newArray));
    // [1,2,3,4,5,1,2,3]

- join: 把数组的所有元素放入一个字符串，元素通过指定的分隔符进行分隔。如果是对象的话会进行toString之后在进行连接。

    let originArray = [{
            array: 234,
            sex: 'male'
        }, function () {
            console.log(23)
        }, 1, 4];
    console.log(originArray.join('-'))；
    //[object Object]-function () {
    //  console.log(23)
    //}-1-4

- pop(): 把数组的最后一个元素删除，并返回。改变元素组

    let array = [1,2,3,4]
    let result = array.pop() 
    console.log(result, array); // 4 , [1,2,3]

- push(): 像数组的末尾添加一个或更多元素，并返回新的长度,改变原数组。

    let array = [1,2,3]
    let result = array.push(4);
    console.log(array, result);4 [1,2,3,4]

- reverse(): 颠倒数组中的元素的顺序。返回结果，并改变原数组。
    
    let array = [1,2,3]
    let result = array.revere()
    console.log(array, result); // [3,2,1] [3,2,1]

- shift(): 删除并返回数组的第一个元素。改变原数组

    let array = [1,2,3]
    let result = array.shift();
    console.log(array, result); // [2,3] 1

- unshift(): 像数组的开头添加一个或更多元素，并返回新的长度。改变原数组。

    let array = [1,2,3,4]
    array.unshift(0); // 5
    console.log(array)  // [1,2,3,4,5]

##### 高级方法

- slice(): 从某个已有的数组返回选定的元素，需要传两个参数。不改变原数组

 第一个参数：必须，规定从何处开始选取，如果是负数，那么规定从数组的尾部开始算起的位置，也就是说-1，值得就是倒数第一个个元素，-2就是倒数第二个。
    第二参数：end，可选，规定从何处结束选取。指的是数组的下标。默认为全部数组元素。

    let newArray = [1,2,3,4,5,6,7,8,9]
    let result = newArray.slice(0,5);//表示从下标0开始剪切到下标5处。
    console.log(result, newArray);
    // [1,2,3,4,5], [1,2,3,4,5,6,7,8,9]
    console.log(newArray.slice(1, -1)) // [2,3,4,5,6,7,8] 从下标1开始剪切到倒数第一个

- sort(): 对数组进行排序，如果调用的方法没有使用参数，将按字母顺序对数组中的元素进行排序，就是按照字符编码排序。如果有传参就按照函数的标准进行排序。改变原数组。

    let newArray = [1, 8, 2, 9, 5, 4, 3];
    //第一种：newArray.sort((a,b) => a - b) // 升序排序 [1, 2, 3, 4, 5, 8, 9]
    // 第二种：newArray.sort((a,b) => b - a) // 降序排序 [9, 8, 5, 4, 3, 2, 1]

- splice(): 删除元素，并根据参数向数组添加新元素。参数：

index：必须，整数，不定添加/删除项目的位置，使用负数可以从数组结尾处规定位置
howmany：必须，需要删除的项目数量，如果设置为-则不会删除项目
item1...item n：可选，向数组中添加新项目

    let newArray = [1,2,3,4,5,6,7,8];
    newArray.splice(1); // 从下标为1的位置开始剪切，一直到末尾
    console.log(newArray)  // [1]
    
    newArray.splice(1,3,9,8,7); // 从下标为1的位置开始剪切，一直到末尾，然后插入9,8,7
    console.log(newArray);  // [1, 9, 8, 7, 5, 6, 7, 8]

- toString(): 把数组转换为字符串，并返回结果。

    let newArray = [1,2,3,4]
    newArray.toString() // "1,2,3,4,"

- valueOf(): 返回数组对象的原始值，简单理解就是返回数组本身。



