---
layout: post
title: javascript---链表
date: 2018-03-18
tags: [ADT]
---

数组这个数据结构有个缺点，就是数组的大小是固定的，从数组的起点或者中间插入或者移除子项成本很高，因为要需要移动很多元素。

链表存储有序的元素集合，但不同于数组，链表中的元素在内存并不是连续放置的，每个元素有一个存储元素本身的节点和一个指向下一个元素的引用组成。对于传统的数组，链表的一个好处在于，添加或者移除元素的时候不需要移动其他元素。然而链表需要使用指针，如果想访问链表中的一个元素，需要从起点开始迭代列表直到找到需要的元素。

## 创建列表

    function LinkedList() {
        let Node = function (element) {
            this.element = element;
            this.next = null;
        }
        let length = 0;
        let head = null
        this.append = function (element) {};
        this.insert = function (position, element) {};
        this.removeAt = function (position) {};
        this.remove = function (element) {};
        this.indexOf = function (element) {};
        this.size = function () {};
        this.getHead = function () {};
        this.toString = function () {};
        this.print = function () {};
    }

Node是一个辅助类，表示要加入列表的项。它包含了一个element属性，既要添加到列表中的值，以及一个next属性，即指向列表中下一个节点的指针。

另一个重要的点就是，我们需要存储第一个节点的引用，把这个引用放在head中。

### 向链表中追加元素

这里有两种场景，第一种列表为空，添加的是第一个元素，或者列表不为空，向其追加一个额元素。

    this.append = function (element) {
        let node = new Node (element) {
            let current;//
            if (head === null) {
                head = node;
            } else {
                current = head;
                //循环列表，直到找到最后一项
                while (current.next) {
                    current = currnet.next;
                }
                //找到最后一项，将它的next赋值为node，建立连接
                length ++;
            }
        }
    }

### 向链表中移除元素

同样的，移除元素也有两种情况，第一种就是移除第一个个以外的任意元素。第二种就是移除第一个元素。我们要实现两种remove方法，第二种就是根据元素的值移除元素。

    this.moveAt - function (position) {
        if (position > -1 && position < length) {//判断条件
            let current = head;
            let previos, index = 0;
            if (position === 0) {//如果要移除的是第一个元素
                head = current.next;
            } else {
                while (index ++ < position) {//一直循环
                    previous = current;
                    current = current.next;
                }
                //将previous与current的下一项连接起来：跳过current， 从而移除他
                previous.next = current.next;
            }
            length --;
            return current.element;
        } else {
            return null;
        }
    }

### 向任意位置插入元素

    this.insert = function (position, element) {
        if (position >= 0 && position <= length) {
            let node = new Node(element);
            current = head;
            previous,
            index = 0;
            if (position === 0) {
                node.next = current;
                head = node;
            } else {
                while (index ++ < position) {
                    previous = current;
                    current = current.next;
                }
                node.next = current;
                previous.next = node;
            }
            length ++;
            return true;
        } else {
            return false;
        }
    }

同样，首先需要检测是否越界。接着，生成一个node节点，把当前的head赋给current，当需要在头部插入一个节点的时候，将新增的节点next指针，指向current相当于指向之前的头结点，之后，让现在的head节点为node。如果不是在头部插入节点，那么我们就需要使用while循环，每次都讲先前的指向当前的current，将current指向下一个节点的指针指向新的current。直到index比position大的时候跳出循环，然后将current赋值给node的next指针，将node赋值给previous的next指针，并更新length即可。

## 双向链表 

双向链表和普通链表的区别在于，在链表中，一个节点只有链向下一个节点链接，而在双向链表中，链向是双向的，一个链向下一个元素，另一个链向前一个元素。

    function DoublyLinkedList () {
        let Node = function (element) {
            this.element = element;
            this.next = null;
            this.prev = null;
        }
    }
    let length = 0;
    let head = null;
    let tail = null;

那么双向链表提供了两种迭代的方法，从头到尾，或者反过来。

### 在任意位置插入新元素

    this.insert = function (position, element) {
        if (position >= 0 && position <= length) {
            let node = new Node(element),
            current = head,
            previous,
            index = 0;
            if (position = 0) {
                if (!head) {
                    head = node;
                    tail = node;
                } else {
                    node.next = current;
                    current.prev = node;
                    head = node;
                }
            } else if (position === length) {
                current = tail;
                current.next = node;
                tail = node;
            } else {
                while (index ++ < postion) {
                    previous = current;
                    current = current.next;
                }
                node.next = current;
                previous.next = node;
                current.prev = node;
                node.prev = previous;
            }
            length ++;
            return true;
        } else {
            return false;
        }
    }

第一种情况，在列表第一个位置插入一个节点，那么列表为空，只需要把head和tail都指向这个新节点。。如果不为空，current变量将是对列表中第一个元素的引用。然后，把node.next设为current，而head将指向node。还需要为指向上一个元素的指针设一个值.