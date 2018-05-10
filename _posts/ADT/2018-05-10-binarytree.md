---
layout: post
title: binary tree
date: 2018-05-10
tags: [ADT]
---

## binary tree

二叉树，树的一种特殊形式，节点度数不超过2的树。最多两个分支，两个叉，可以称相对于某而言的左子树，某而言的右子树，默认左在先，右在后。

### 基数

深度为k的节点至多2^k个，含n个节点，高度为h的二叉树中

    h < n < 2 ^ (h + 1)
    当n = h + 1的时候，退化为一个单链

除了叶子结点外的每一颗树都是两个节点，则是满树。同样高度下， 顶点个数最多。饱和状态。宽度是高度的指数。

<img src="http://os310ujuc.bkt.clouddn.com/doubletree.png">

#### 真二叉树

真二叉树：每个节点的出度都是偶数，或者是2或者是0.如果度数为1，就为它添加节点，使之成为一个度数为2的树。（更加便于算法的实现）

#### 描述多叉树

通过二叉树来描述多叉树。二叉树是多叉树的特例，只要是有跟，有序的树都可以通过二叉树进行描述。

将每一个节点的局部，即nextSilbing和firstChild两者进行45度的旋转，即可转化为二叉树的形式。

<img src="http://os310ujuc.bkt.clouddn.com/bainarytree.png">

### 二叉树的实现

#### BinNode 模板类

每个binnode核心是一个data域，作为一个整体结构，有引用域，分别指向child和parent，具有一个height指标，对于红黑树还有颜色指标，对于左式堆而言，还有npl指标。

    #define BinNodePosi(T) BinNode<T> * 
    template <typename T> struct BinNode{
        BinNodePosi(T) parent, lChild, rChild; //父亲， 孩子
        T data; int height; int size(); //高度 子树规模
        BinNodePosi(T) insertAsLC(T const &); //作为左孩子插入新节点
        BinNodePosi(T) insertAsRC(T const &); //作为右孩子插入新节点
        BinNodePosi(T) succ(); // (中序遍历下，当前节点的直接后继)
        template <typename VST> void travLevel (VST & ); //子树先序遍历
        template <typename VST> void travPre (VST &); // 子树中序遍历
        template <typename VST> void travPost( VST &); //子树后序遍历
    }

    template <typename T> BinNodePost(T) BinNode<T>::insertAsLC(T const & e)
    {
        return lChild = new BinNode (e, this);// data域为e，父节点为this
    }
    template <typename T> BinNodePosi(T) BinNode<T>::insertAsRC(T const & e)
    {
        return rChild = enw BinNode (e, this)
    }
    template <typename T> int BinNode<T>::size() 
    {
        int s = 1; 
        if (lChild) s += lChild -> size(); // 递归计入左子树规模
        if (rChild) s += rChild -> size(); //递归计入右子树规模
        return s;
    }// O(n = [size])

然后就可以实现BinTree类了。

    template <typename T> ckass BinTree{
        protected:
            int _size;
            BinNodePosi(T) _root;
            virtual int updateHeight( BinNOdePosi(T) x);
            void updateHeightAbove(BinNodePosi(T) x);
        public:
            int size() const {return _size;}// 规模
            bool empty() const {return _root}// 判空
            BinNodePosi(T) root() const {return _root;};//树根
    }

##### 高度更新

对于任意一个节点x，表示该节点通往最深的叶节点。考虑，如果只有只有一个节点的情况，或者空树（height=0）。通过宏定义方式命名。

准确来说，一个树的高度等于其左节点和右节点中较大者加一。
 
    #define stature(p) ((p) ? (p) -> height : -1) // 节点高度——约定空树高度为-1
    template <typename T> //更新节点高度，具体规则因树不同而异
    int BinTree<T>::udateHeight (BinNodePost(T)x) {
        return x->height = 1 + max( stature( x -> lChild ), stature(x->rChild));//此处采用常规的二叉树规则，O(1)
    }
    template <typename T>
    void BinTree<T>::updateHeightAbouve(BinNodePosi(T)x) {
        while(x){
            updateHeight(x); x = x->parent;
        }// O(n = depth(x))
    }

##### 生成节点

    template <typename T> BinNodePosi(T)
    BinTree<T>::insertAsRc(BinNodePosi(T) x, T const & e) {
        _size++;
        x -> insertAsRC(e);// x祖先的高度可能增加，其余节点必然不变
        updateHeightAbove(x);
        return x -> rChild;
    }

将新生成的节点的位置指向右节点。拓补连接完成之后，需要更新一下x节点的高度进行更新。