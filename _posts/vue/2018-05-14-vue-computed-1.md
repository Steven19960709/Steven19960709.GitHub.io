---
layout: post
title: Vue学习笔记（2）
date: 2018-05-14
tags: [vue]
---

## 计算属性

模板内如果放入太多逻辑会让模版过重难以维护。例如：

    <div id="example">
        {{message.split('').reverse().join('')}}
    </div>

这样，模版不再是简单的声明式逻辑，而是比较复杂，不能一眼就看出来，这时候就需要使用计算属性。

    let vm = new Vue({
        el: '#example",
        data: {
            message: 'hello'
        },
        computed: {
            reversedMessage: function() {
                return this.message.split('').reverse().join('');
            }
        }
    })

### computed VS methods

如果在methods中添加computed的方法，其实也可以实现相同的功能。

    methods: {
        reversedMessage: function () {
            retunr this.message.split('').reverse().join('')
        }
    }

但是，computed和methods两者的实现还是有区别的。<h4>计算属性是基于它们的以来进行缓存的。九三属性只有在他的相关依赖发生改变的时候才会重新求值。这就意味着，只要message还没有发生改变，多次访问reversedMessage，计算属性会立即返回之前的计算结果，而不会再次执行函数。</h4>

同样，以下例子不会发生更新：

    computed: {
        now: function () {
            return Date.now()
        }
    }// 因为now不是响应式依赖

#### computed使用场景

假设我们有一个开销比较大的计算属性A，它需要遍历一个巨大的数组并作大量的计算。然后我们可能有其他的计算属性依赖于A。如果没有缓存，我们可能需要多次执行A的getter！所以针对耗性能的操作而且不需要时常更新的场景，可以使用计算属性。

### computed VS watch

Vue提供了一种更通用的方式来观察和相应Vue实力上数据的变动：侦听属性。当数据需要随着其他数据变动而变动时，watch很容易被滥用，但是通常更好的做法是使用计算属性，而不是命令式的watch回调。

    let vm = new Vue({
        el: "#demo",
        data: {
            firstName: 'Steven',
            lastName: 'Leung',
            fullName:  "Steven Leung"
        },
        watch: {
            firstName: function (val) {
                this.fullName = `${val} ${this.lastName}`
            },
            lastName: function (val) {
                this.fullName = `${this.firstName} ${val}`
            }
        }
    })
    // 改用computed
    computed: function (val) {
        return this.fullName = `${this.firstName} ${ this.lastName}`
    }

这样代码量更少，而且更简洁易懂。

#### setter

那么对于计算属性中的方法，可以为其添加特定的setter函数，在对其进行set操作的时候可以进行特定的操作。

    computed: {
        // ...
        set: function (newValue) {
            let names = new Value.split(' ');
            this.firstName = names[0];
            this.lastName = names[names.length - 1];
        }
    }

然后，当我们输入vm.fullName = "John Doe"的时候，setter会被调用，vm.firstName和vm.lastName也会相应被更新。

## class 与 style 绑定

操作元素的class列表和内联样式是数据绑定的一个常见需求。因为它们都是属性，所以我们可用v-bind进行处理。对于需要字符串拼接的class和style，应该咋弄呢？

### 绑定HTML class

#### 对象语法

    <div v-bind:class="{active: isActive, 'text-danger': hasError}"></div>

active取决于isActive的布尔值。text-danger取决于hasError的值。

也可以将对象提出来放在data里面。  

    <div v-bind:class="classObject"></div>
    data: {
        classObject: {
            active: true,
            'text-dange:' : false
        }
    }

#### 数组语法

    <div v-bind:class="[activeClass, errorClass]"></div>
    data: {
        activeClass: 'active',
        errorClass: 'text-danger'
    }
    // 结果
    <div class="active text-danger"></div>

### 绑定style

对于style的绑定同样是采用驼峰式命名。

    - <div v-bind:style="{color: activeColor, fontSize: fontSize + 'px'}"></div>
    - <div v-bind:style="styleObject"></div>
    - <div v-bind:style="[baseStyles, overridingStyles]"></div>

## 今日总结

最后，总结一下，今天的主要学习了

- computed，计算属性，与methods区别在于computed存在缓存，只用当源对象改变的时候才会从新计算，适用于不频繁改变的情况。
- watch不能滥用
- v-bind:style和v-bind:class的对象语法和数组语法。