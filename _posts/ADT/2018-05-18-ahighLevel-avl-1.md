---
layout: post
title: 伸展树
date: 2018-05-18
tags: [ADT]
---

## 伸展树

AVL树，典型的适度平衡的二叉搜索树，有平衡因子这个概念，平衡因子数值介于-1到1.但是条件过于苛刻。如果我们想将条件宽松一点，从长远，从整体又不失平衡性，这个时候就可以引出——伸展树了。

动机：试图利用所谓的局部性，刚被访问过的数据，极有可能很快滴再次被访问，这一现象在信息处理过程中屡见不鲜。（BST就是这样一个例子）

BST：下一个将要访问的节点，极有可能就在刚被访问节点的附近。

连续m次查找，avl树供需O(mlogn)时间。

### 自适应调整

<img src="http://os310ujuc.bkt.clouddn.com/avl32.png">

在列表结构中，可以根据逻辑关系，排成一个序列，相邻的元素有前驱和后继关系。具体来说，根据秩进行访问，秩越靠后，性能就越差。

根据局部性，当我们访问过一个节点，那么下一个节点很可能就在这个访问节点的附近。列表的前端，访问效率是最高的。

然后我们将BST进行旋转，可以看出，在树根的位置，访问效率是比较高的。这个时候，我们就需要尽量将节点提到树根周围，这样访问效率就比较高了，即减少节点的的高度。

### 逐层伸展

策略：节点V一旦被访问，随即转移至树根位置（通过等价变换，zig和zag）, 使得v的高度逐层上升，直至到达树根。

<img src="http://os310ujuc.bkt.clouddn.com/avl33.png">

节点上升的过程，是一个左右节点不断摇摆的过程，所以称之为——伸展。

### 最坏情况

<img src="http://os310ujuc.bkt.clouddn.com/avl34.png">
<img src="http://os310ujuc.bkt.clouddn.com/avl35.png">
<img src="http://os310ujuc.bkt.clouddn.com/avl36.png">
<img src="http://os310ujuc.bkt.clouddn.com/avl37.png">
<img src="http://os310ujuc.bkt.clouddn.com/avl38.png">

<img src="http://os310ujuc.bkt.clouddn.com/avl39.png">


对于这种情况的查找访问,所对应的计算成本为n^2量级，每次操作的成本为O(n)，已经退化成线性结构了。

### 双层伸展

策略：不再是逐层伸展，而是两层。反复考察祖孙三代，更具它们的相对位置，经两次旋转使得v上升两层，得到（子）树根

#### zig-zag/zag-zig

节点V是左孩子，而z是右孩子，对于节点p进行旋转，再对g进行zag在、旋转，最终v成为树根，上升了两层。对父节点，然后从祖父节点进行旋转。

#### zig-zig/zag-zag

<img src="http://os310ujuc.bkt.clouddn.com/avl40.png">

对于这种情况，也就是节点v和其父亲都是左孩子，v首先经过p的一次zig旋转，在通过g的zig旋转，上升至根节点。

对于使用双层旋转，则祖父节点先zig一次，p和v都会上升，最后p再zig一次，v上升至树根。

每次想访问最深的节点，每一次的双层伸展，树的高度都会缩减为一半。

#### 分摊性能

一旦经过访问，这个节点所对应的长度，对应的路径长度随机减半，最坏的情况不致持续发生，单趟伸展操作，分摊O(logn)时间。

<img src="http://os310ujuc.bkt.clouddn.com/avl41.png">

#### 最后一步

如果只有父亲，没有祖父，此时需要看parent(v) == root(t)视具体形态，做单次旋转zig或zag即可。

### 实现

<img src="http://os310ujuc.bkt.clouddn.com/avl42.png">

作为BST的变种，还是有BST类进行派生得到。需要重写insert和remove接口，另外还需要重写search接口，对于伸展树，search也会导致全树的接口变化。splay接口用来实现完成伸展。

<img src="http://os310ujuc.bkt.clouddn.com/avl43.png">

判断是否存在父亲和祖父节点，是的话进行双层伸展，另外还需判断是zig还是zag。对于p是根节点，进行特殊处理。针对四种情况还需要分别应对。

<img src="http://os310ujuc.bkt.clouddn.com/avl44.png">

对于zig-zig，即父亲节点和祖父节点都是左节点，attachAsLChild就是将g成为p的左节点，一步一步进行操作。

#### 查找接口

<img src="http://os310ujuc.bkt.clouddn.com/avl45.png">

调用searchIn接口，查找e的节点，成功就进行伸展并返回树根。如果失败，就会将搜索终点返回给树根。注意的search算法不再是静态的了。

#### 插入算法

<img src="http://os310ujuc.bkt.clouddn.com/avl46.png">

#### 删除算法

<img src="http://os310ujuc.bkt.clouddn.com/avl47.png">

同样的，首先按照标准算法进行删除，然后再将hot伸展到树根。

先对目标先定位，然后将v释放掉，再讲两个节点树进行合并。

### 综合评价

相比AVL，伸展树更为灵活，不需要平衡因子和树高，依然能确保复杂度为logn。当局部性比较强的时候，缓存命中率极高时，效率甚至更高——自适应的O(logk)。任何连续的m次查找，都可在（mlogk + nlogn）时间内完成。

但是仍然不能保证单词最坏情况的出现，不适合于效率敏感场合。