---
layout: post
date: 2018-05-01
tags: [share]
title: 字符串扩展方法实现
---

这里主要是实现一些字符串的方法，来对原生的ES进行扩展。

#### contains方法

判定一个字符串是否包含另一个字符串。常规思维是使用正则表达式，但是每次都要new RegExp来构造，性能非常差，那么我们可以使用原生的一些字符串方法，如indexOf，lastIndexOf，search，来实现。

    function contains (traget, it) {
        return target.indexOf(it) != -1;
    }

这个方法可以用来判断className是否存在某个class。

#### startwith

这分方法是用来判定目标字符串是否位于原字符串的开始处。

    function startWith(target, str, ignorecase) {
        let start_str = target.substr(0, str.length);
        return ignorecase ? start_str.toLowerCase() === str.toLowerCase() : start_str === str;
    }

#### endsWith()

与startwith相反，用来判定目标字符串是否位于原字符串的末尾。  

    function endWith(target, str, ignorease) {
        let end_str = target.substring(target.length - str.length);
        return ignorecase ? end_str.toLowerCase() === str.toLowerCase()
                    : end_str === str;
    }

#### repeat()

讲一个字符串重复自身N次，如repeat('ruby', 2)等到RubyRuby。
    
    way1: use the join function
    function repeat(target, n) {
        return (new Array(n + 1)).join(target);
    }// 3个元素两个空位

第一种方法创建了数组，性能不是很好，我们可以使用一个对象，利用call方法去掉用数组原型的join方法，省去创建数组的步骤，性能大大提高。需要length属性，是因为需要调用数组的原型方法，需要指定call的第一个参数为类数组对象，而类数组对象的必要条件就是有length属性，而且是非负数。  

    function repeat(target, n) {
        return Array.prototype.join.call({
            length: n + 1
        }, target);
    }

way3，更好的方法就是利用闭包，将join方法进行缓存，避免每次都重复创建欲寻找方法。

    let repeat = (function () {
        let join = Array.prototype.join,
            obj = {};
            return function (target, n) {
                obj.length = n + 1;
                return join.call(obj, target);
            }
    })()

way4,从算法入手，当我们复制多次的时候，可以利用之前的结果而不用重新复制。例如，复制5次，我们可以利用前两次的复制结果，得到的字符串最后只复制一个就好了。

    function repeat(target, n) {
        let s = target,
            total = "",
        while (n > 0) {
            if (n % 2 == 1) {
                total += s;
            } 
            if (n == 1) {
                break;
            }
            s += s; 
            n = n >> 1;
        }
        return s;
    }

#### byteLen()

取得一个字符串所有字节的长度。这是一个后端过来的方法，如果将一个因为字符插入数据库插入，varchar,text类型的字段是占用一个字节，而将一个中文字符插入时占用两个字节。为了避免插入溢出，就需要事先判断字符串的字节长度。在前端，如果我们要用户填写文本，限制字节长度也是很常用的。

way1：假设当字符串每个字符的Unicode编码均小于或等于255时，byteLength为字符串的长度；再遍历字符串，当遇到Unicode编码大于255时，为byteLength补加1.

    function byteLen(target) {
        let byteLength = target.length,
            i = 0;
            for (; i < target.length; i++) {
                if (target.charCodeAt(i) > 255) {
                    byteLength ++;
                }
            }
        return byteLength;
    }

way2: 使用正则表达式,并支持设置汉字的存储字节数。

    function byteLen(target, fix) {
        fix = fix ? fix : 2;
        let str = new Array(fix + 1).join('-');
        return target.replace(/[^\x00-\xff]/g, str).length;
    }

#### truncate方法

用于对字符串进行截断处理。当超过限定长度，默认添加3个点号。

    function truncate(target, length, truncation) {
        length = length || 30;
        truncation = truncation === void(0) ? '...' : truncation;
        return target.length > length ?
            target.slice(0, length - truncation.length) + truncation : string(target);
    }

#### camelize方法

转换为驼峰风格.

    function cameLize(target) {
        if (target.indexOf('-') < 0 && target.indexOf('-') < 0) {
            return target; // 提前判断，提高效率
        }
        return target.replace(/[-_][^-_]/g, (match) => {
            return match.charAt(1).toUpperCase();
        })
    }

#### underscored方法：转换为下划线风格

    function underscored(target) {
        return target.resplace(/([a-z\d])([A-Z])/g, '$1_$2').
            replace(/\-/g, '_').toLowerCase();
    }

#### escapeHTML方法

将字符串经过HTML转移得到适合在页面显示的内容，如将"<"替换成“\&lt;”。用于防止XSS攻击。

    function escapeHTML(target) {
        return target.replace(/&/g, '&amp')
            .replace(/</g, '&lt')
            .replace(/>/g, '&gt')
            .replace(/"/g, "&quot")
            .replace(/'/g, "&#39");
    }

#### unescapeHTML方法

将字符串中的HTML实体字符还原为对应字符。

    function unescapeHTML(target) {
        return String(target)
                .replace(/&#39;/g, '\'')
                .replace(/&quot;/g, '"')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&')
    }

escapeHTML方法和UNescapeHTMML方法，不但在replace的参数是反过来的，replace的顺序也是反过来的。他们在做HTML parse非常有用，但是要注意浏览器的兼容性。

#### escapeRegExp

将字符串安全格式化

    function escapeRegExp(target) {
        return target.replace(/([-.*+?^${}() | [\]\/\\])/g, '\\$1')
    }
