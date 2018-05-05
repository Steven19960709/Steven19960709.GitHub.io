---
layout: post
title: CSS选择器总结
date: 2018-05-03
tags: [css]
---

这篇文章主要是介绍一下关于css选择器的相关内容。

## 基本分类

css的选择器总的来说，分为4大类，16种。分别是并联选择器，简单选择器，关系选择权，和伪类。

- 并联选择器：逗号','，一种不是选择器的选择器，用于合并多个分组的结果。
- 简单选择器分为5种：ID，Tag，class，属性，通配符
- 关系选择器：父子选择器，后代选择器，兄弟选择器
- 伪类选择器：动作伪类，目标伪类，语言伪类，状态伪类，取反伪类

### 简单选择器

- ID：利用#号来进行选择
- 类选择器：利用"."来进行选择
- 属性选择器：利用"[]"来进行选择，例如：

    [att],[att==val],[att~=val],[att\*=val],[att^=val] (开头),[att$=val] (结尾),[att*=val]

- 通配符选择器: "*",通常用来初始化各种标签的样式
- 标签选择器：不包含特殊字符的应为数字组合

### 关系选择器

关系选择器是不能单独存在的，它必须夹在其他种类的选择器当中使用，但某些选择器引擎可能允许她放在最开始的位置。

#### 后代选择器：father son1 son2

#### 父子选择器：father > son

    function getChildren(el) {
        if (el.childElementCount) {
            return [].slice.call(el.children).
        }
        let ret = [];
        for (let node = el.firstChild; node ; node = node.nextSibling) {
            node.nodeType == 1 && ret.push(node);
        }
        return ret;
    }

#### 相邻选择器：E + F 

    function getNext(el) {
        if ("nextElementSibling" in el) {
            return el.nextElementSibling;
        }
        while(el == el.nextSibling) {
            if (el.nodeType === 1) {
                return el;
            }
        }
        return null;
    }

#### 大哥选择器

选取左边的所有同级节点。

    function getPrev(el) {
        if ("previoseElementSibling" in el) {
            return el.previousElementSibling;
        }
        while( el == el.previousBling) {
            if (el.nodeType === 1) {
                return el;
            }
        }
        return null;
    }

这里做一个DOM操作的小总结：

                    遍历所有子节点                             遍历所有子元素
    最前的           firstChild                               firstElementChild
    最后的           lastChild                                lastElementChild
    前面的           previousSibling                          previousElementSibling
    后面的           nextSibling                              nextElementSibling
    上面的           parentNode                               parentElement
    长度             length                                   childElementCount

#### 伪类

伪类是选择器中最庞大的家族，以字符串开头，在CSS3中出现了要求传参的结构伪类和取反伪类。

##### 动作伪类

动作伪类又分为链接伪类和用户行为伪类，其中链接伪类有:visited和:link组成，用户行为伪类由：hover，：active和focus组成。

##### 目标伪类

目标伪类即：target伪类，指其id或者name属性与URL中的hash部分（即#之后的部分）匹配上的元素。

##### 语言伪类

语言伪类即:lang伪类，用来设置使用特殊语言内容的样式。比如:lang(de)的内部应该为德语，需要特殊处理。注意lang虽然作为DOM元素的一个属性，但:lang伪类与属性选择器有所不同，具体表现在lang伪类具有“继承性”，例如：

    <body>
        <p>
            somethings 
        </p>
    </body>

如果使用[lang=de]只能选到body元素，因为p标签没有lang属性。但是使用:lang(de)则可以同时选到body和p标签，因为依类具有继承特点。

##### 状态伪类

状态伪类用于标记一个UI元素的当前状态，由:checked、:enable、:disable、:indeterminate这四个伪类组成。分别用过元素的checked,disabled,indeterminate属性进行判断。

#### 取反伪类

取反伪类即:not伪类，它的参数为一个或多个简单选择器，用逗号隔开。

### Sizzle

jQuery的选择器引擎叫做Sizzle，介绍一下几个概念。

种子集：或则叫做候选集，如果CSS选择符非常复杂，我们需要分几步才能得到我们想要的元素，那么第一次得到的元素集合就叫做种子集。在Sizzle这样基本从右到左，它的种子集就有一部分是我们最后得到的元素。对于引擎选择，就是通过最右边的选择器组得到的元素集合，比如说div.aaa span.bbb，最右边的选择器组就是span.bbb，这时引擎会根据浏览器的情况选择getElementsByTagName或者getElementsClassName得到一组元素，然后再通过擦历史上Name或则tagName进行过滤，这个时候得到的就是种子集。

映射集：当我们取到种子集后，不动种子集，而是将种子复制一份出来，这就是映射集。种子是有一个选择器组选出来的，这时选择符不为空，必然往左就是关系选择器。关系选择器会让引擎去选取其兄长或者父亲，把这些元素置换到候选集对等的位置上。

那么对于span.aaa，是先取span还是先取aaa呢，这里有个准则，即确保我们后面的映射集最少化。直白地说，如果映射集里的元素越少，那么调用过滤函数的次数就越少，即调用函数的次数越少，说明进入到另一个函数作用域做成的能耗就越少。从而整个提高了引擎的选择速度。

