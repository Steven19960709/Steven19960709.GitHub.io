---
layout: post
title: Previous traversal
date: 2018-05-11
tags: [ADT]
---

为了按照某种次序访问树中各节点，每个节点敲好被访问一次。

先序遍历：V---L---R
中序： L---V---R
后序遍历：L---R---V

http://os310ujuc.bkt.clouddn.com/brotree.png

<img src="http://os310ujuc.bkt.clouddn.com/order.png">

### 先序遍历

递归方式：

    template <typename T, typename VST>
    void traverse(BinNodePosi(T) x, VST & visit) {
        if (!x) return;
        visit (x -> data); // 先访问根节点
        traverse( x -> lChild, visit);// 访问左节点
        traverse( x -> rChild, visit);// 访问右节点
    }// T(n) = O(n)

需要具有通用的格式，原式不能足够的小。因此需要将递归形式改写为迭代形式。递归调用属于尾递归，容易改写为迭代形式，需要引入一个栈。

迭代方式：

    template <typename T, typename VST
    void travPre_I1( BinNodePosi(T) x, VST & visit) {
        Stack <BinNodePosi(T)> S; // 辅助栈
        if (x) S.push(x); // 根节点入栈
        while (!S.empty()) {
            // 在栈变空之前反复循环
            x = S.pop();
            visit( x -> data); //弹出并访问节点
            if (HasrRchild( *x )) S.push( x -> rChild ); //右孩子先入后出
            if( HasLChild( *x )) S.push( x->lChild) ; // 左孩子后入先出
        }
    }

根据栈后进先出的特性，所以右子树先入栈，左子树入栈。

<!-- <img src="chttp://os310ujuc.bkt.clouddn.com/diedal.png"> -->
<img src="http://os310ujuc.bkt.clouddn.com/diedai.png">

先遍历根节点，然后是左节点，再是右节点，称为<h4>右顾左盼</h4>

a先入栈，进入while循环，弹出栈顶，a被弹出，标为已被访问，观察是否有左孩子，b入栈，看是否有右孩子，c入栈，于是while非空，在进入循环，b被弹出，b没有做孩子，也没有右孩子，标位黑色后，进入下一个循环；弹出C，发现有右孩子f，f入栈，在访问左孩子，d入栈，进入下一个循环；同样的，栈顶弹出d，访问右节点e，e入栈，没有左孩子，进入下一个循环；栈非空，f弹出，没有右孩子，没有左孩子，遍历结束。

迭代方式2：

左侧链（从r开始，一直指向左节点）展开，所有的二叉树都可以被看作

自顶向下访问左侧脸上的沿途节点，然后自底向上的访问每一颗右子树，这就是先序遍历的宏观过程。

    template <typename T, typename VST> 
    static void visitAlongLeftBranch(
        BinNodePosi(T) x,
        VST & visit,
        Stack <BinNodePosi(T)> & S
    )// 实现访问沿途的节点
    {
        while (x) {//反复地访问当前节点
            visit (x -> data);//访问当前节点
            S.push( x -> rChild);// 右节点（右子树）入栈（即将逆序出战）
            x = x -> lChild;// 延左侧链下行
        }// 只有右孩子，NULL可能入栈
    }
    // 主算法
    template <typename T, typename VST>
    void travPre_I2 ( BinNodePosi(T) ， VST & visit) {
        Stack <BinNodePosi(T)> S;//辅助栈
        while (true) {// 以（右）子树为单位，逐批访问节点
            visitAlongLeftBranch( x, visit, S);// 访问子树x的左侧链，右子树入栈缓冲
            if ( S.empty() ) break;// 栈空即退出
            x = S.pop();// 弹出下一个子树的根
        }
    }

每一步迭代，都可以认为在栈中弹出一个当前的节点，进入以S为根节点的子树，然后调用历程进行访问。一旦栈变空，循环退出。

<img src="http://os310ujuc.bkt.clouddn.com/diedai2.png">
<!-- <img src="http://os310ujuc.bkt.clouddn.com/diedai2.png"> -->
如果是空的右子树，则会push进一个null。