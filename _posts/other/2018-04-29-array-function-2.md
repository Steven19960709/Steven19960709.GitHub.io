---
layout: post
title: 数组方法整理（ES5,ES6）
date: 2018-04-29
tags: [JavaScript]
---

## ES5 

- every(): 检测数组中的元素是否每个元素的符合条件。

    let newArray = [1,2,3,4,5,6,7,8];
    newArray.every((item) => item > 0 ? true : false); // true
    newArray.every((item) => item > 10 ? true : false); //false

- filter(): 检测数组元素，并返回符合条件的所有元素的数组。

    let newArray = [1,2,3,4,5,6,7,,8];
    newArray.filter((item) => item > 4);  // [5, 6, 7, 8]
    

- indexOf(): 搜索数组中的元素，并返回他所在的位置（下标）.

    let newArray = [1,2,3,4,5,6,7,8];
    newArray.indexOf(3);  // 2

- lastIndexOf(): 返回一个指定的字符串值最后出现的位置，在一个字符串中的指定位置以后向前搜索。

    let newArray = [1,2,3,4,5,5,6,5,6];
    newArray.lastIndexOf(5);  // 7 

- map(): 通过指定的函数处理数组的每一个元素，第二个参数，是对象作为执行回调时使用，传递给函数，用做'
this'的值，并返回处理后的数组。传进的函数有几个参数。

    - currentValue: 当前元素的值
    - index: 当前元素的index
    - arr: 当前元素属于的数组对象    

    let array = [1,2,3,4,5];
    let newArray = array.map(item => item + 2);
    console.log(newArray);  // [3,4,5,6,7]

- some(): 检测数组元素中是否有元素符合指定条件。

    let array = [1,2,3,4,5];
    array.some( item => item > 3); // true    

- reduce(): 接受一个函数作为累加器，数组的每个值（从左到右）开始缩减，最终计算为一个值。利用这个方法我们可以计算n项和。

传进的函数的参数：

    total: 必须，初始值，或者计算结束后的返回值
    currentValue：必须，当前元素
    currentIndex：可选，当前元素的索引
    arr: 可选，当前元素所属的数组对象

    let array = [1,2,3,5]
    let result = array.reduce((total, currentValue) => {
        return total + currentValue; //  1 + 2 + 3 + 5  = 11
    })

- forEach(): 用于对数租的每个元素调用函数。

    let array = [1,3,5];
    array.forEach((item) => {
        if (item > 3) {
            console.log(item); // 5
        }
        return false;
    })

## ES6

- find(): 返回符合传入测试（函数）条件的数组元素。

        let arr = [1,2,3,4,5,6];
        arr.find(item => item > 5) // 6;

- findIndex(): 返回符合传入测试（函数）条件的数组元素索引。

        let arr = [1,2,3,5];
        arr.find(item => item > 0); // 0，第一个1就比0大，马上返回

- fill()：指定的值来填充一到多个数组元素。当传入一个值的时候，fill方法会用这个值重写数组中的所有值。

        let number = [1,2,3,4,5,6];
        number.fill(1);
        console.log(numbers.toString()); // 1,1,1,1

- copyWithin(): 从数组中复制元素的值，调用copyWithin()，方法时需要传入两个参数：一个是该方法开始填充值的索引位置，另一个是开始复制值的索引位置。

        let numbers = [1,2,3,4];
        numbers.copyWithin(2,0);
        console.log(numbers.toString()); // 1,2,1,2
        let new = [1,2,3,4];
        // 从索引2开始粘贴值，
        // 从索引0开始复制值
        // 当位于1的时候停止复制值
        numbers.copyWithin(2,0,1);
        console.log(numbers.toString()); /1,2,1,4

