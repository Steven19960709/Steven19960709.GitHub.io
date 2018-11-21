---
layout: post
title: 使用深度优先算法更新扫雷
date: 2018-11-21
tags: [JavaScript]
---

今天把两年前的写来玩的扫雷代码重构了一下。

- 第一：使用了深度优先算法来进行点击时候非雷区，且数字为0的地区进行扩散。
- 第二：优化了代码结构，把零散的全局变量进行压缩，放到对应的作用域中。
- 第三：大量减少if语句和for循环的时候。通过在DOM对象上直接挂相关信息，例如周围存在的雷数,本身是否为雷等。
- 第四：把原来的代码结构分离，html，css和js分在不同文件中。

优化结果显示，比原来的计算时间提高1ms左右，提高100%。扩展了原来的扩展功能。

那么下面对深度优先算法做一个简单的记录已经介绍。

深度优先算法的具体思路就是选取一个点，沿着这个点一直遍历，直到遍历的结果中出现于要求的点不符的点，回到原来的点进行下一个遍历。

具体的做法是当我们点击一个区域的时候，如果这个区域的九宫格中没有雷，将会进行一次计算把他附近的所有0雷区的地块全部显示出来。

        ul.addEventListener('click', function(e) {// 采用事件委托的方式来绑定事件
            if (e.target.count !== 0) { // 如果不是0的话就会inner这个li附近的雷数
                e.target.innerHTML = e.target.count; // 雷数
            }
            if (e.target.count === 0) { // 如果是0，表示要进行一个深度优先算法
                e.target.innerHTML = e.target.count;
                book[e.target.i] = 1; // book数组是一个用来记录该地区是否被遍历过的数组，记为1表示已经遍历过了
                dfs(e.target.i) // 算法核心
            }
            if (e.target.booms) { // 点击到雷区了
                e.target.innerHTML = 'boms'
                alert('come on guys , play again')
            }
        })
        let next = [-1, 1, 10, -10] // 表示上下左右四个点的方向坐标
        let book = []; // 记录那些点被遍历过了
        function dfs (j) {
            for (let i = 0; i < next.length; i++) {// j为中心区域的地块
                if (li[j + next[i]] &&  li[j+next[i]].count === 0 && book[j + next[i]] === undefined) { //检查是否越界，是否已经遍历过
                    if (!(j % 10 === 0 && next[i] == -1) && !(j % 10 === 9 && next[i] === 1)) {// 因为这里的li是一个数组。当在左边地区或者右边地区的时候是不需要进行扩散的（70不需要向69扩散），排除分别为10的整数倍和19，29这种%10余9的情况
                        book[j+next[i]] = 1; // 记录这个点已经遍历过了
                        li[j+next[i]].innerHTML = li[j+next[i]].count; // inner进去0
                        dfs(j+next[i]) // 递归执行，执行其他点的搜索
                        book[j] = undefined; // 这个很重要，如果不重置undefined就无法进行下一个点的遍历了
                    } ;
                }
            }
            return ;
        }
    
基本上核心的dfs结合扫雷的逻辑代码如上。主要是多了一些越界条件的筛选。