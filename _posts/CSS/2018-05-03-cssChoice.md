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

<table>
<tbody>
<tr>
<td></td>
<td>
<h4 style="padding:12px;">遍历所有子节点</h2style>
</td>
<td>
<h4 style="padding:12px;">遍历所有子元素</h4>
</td>
</tr>
</tbody>
</table>

