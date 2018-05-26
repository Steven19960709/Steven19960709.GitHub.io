---
layout: post
title: 优先级队列（2）
date: 2018-05-24
tags: [ADT]
---

## 左式堆

为了能够有效堆得合并，对于任何的堆A和堆B，对其进行合并，已有的方法效率都不高。例如，在两个堆中选择更大的为基础，将另一个堆取出元素合并到前一个堆中。但是效率很低。如下图方法一。方法二，是利用弗洛伊德批量建堆算法，将两个堆中的元素简单混合，然后整理成一个完全二叉堆。即使是线性的效率，但是依然不行。因为所有的元素默认都是无序排列的，对于已知内部的偏序关系的数据结构，这个算法没有应用以上条件。左式堆就可以解决这些问题。

<img src="http://os310ujuc.bkt.clouddn.com/pri18.png">

### 奇中求正。

左式堆，就是保持堆序性，附加新条件，使得对合并过程中，只需调整很少部分的节点O(logn)。

<img src="http://os310ujuc.bkt.clouddn.com/pri19.png">

所有的合并操作，只会涉及到全对的右侧部分。向左侧倾斜，可以将右侧长度控制在logn，那么就可以将节点的复杂度控制在logn。但是，这样就不能在保证是完全二叉树了。对于完全二叉堆，堆序性是重要的，但是对于结构性，必要时候可以牺牲。

### 空节点路径长度

<img src="http://os310ujuc.bkt.clouddn.com/pri20.png">

对于任意的x，它的NPL的值，是以他为跟的最大满子树高度。

### 左倾性

左倾：对于任何内部节点x，都有npl(lc(x)) >= npl(rc(x))
推论：对任何内部节点x，都有npl(x) = 1 + npl(rc(x))

<img src="http://os310ujuc.bkt.clouddn.com/pri21.png">

### 右侧链

<img src="http://os310ujuc.bkt.clouddn.com/pri22.png">

在左式堆中，真正重要的是左式堆的右侧链，即从节点x触发，一直沿右分支前进的分支称为右侧链。如果r的npl值为d，则不仅意味着这个外部节点的深度也为d，必然存在一个高度为d的最大满子树。

### 合并

<img src="http://os310ujuc.bkt.clouddn.com/pri23.png">

LeftHeap，左式堆模板类的定义。既然左式堆不自满足结构性，物理结构则同样不满足连续存储的特性。所以不再适用向量进行派生，使用树形结构进行派生。最大元总是对应于根节点。

<img src="http://os310ujuc.bkt.clouddn.com/pri24.png">

使用递归的模式进行实现。将a从右子树中取出，然后与b合并，合并之后的子树，有座位a的右子堆，需要比较npl值，看看是否需要互换位置，保证a不小于b。是b可以作为a的后代。

<img src="http://os310ujuc.bkt.clouddn.com/pri25.png">

实例：
<img src="http://os310ujuc.bkt.clouddn.com/pri26.png">

### 插入与删除

基于合并操作，可以实现插入和删除。

insert():

<img src="http://os310ujuc.bkt.clouddn.com/pri27.png">

delMax():

每次删除都需要将e摘除，然后将两个堆进行合并。

<img src="http://os310ujuc.bkt.clouddn.com/pri28.png">
