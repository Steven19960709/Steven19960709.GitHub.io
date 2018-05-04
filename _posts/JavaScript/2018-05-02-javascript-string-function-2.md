---
layout: post
title: 字符串方法总结
date: 201-05-02
tags: [JavaScript]
---

这篇文章是总结一下字符串的方法。亲测准确。

#### charAt()

方法很常用，是用来返回指定位置的字符。传进一个参数，表示返回的位置。

    let str = 'hello world';
    console.log(str.charAt(4));  // 'o';

#### charCodeAt()

用来返回指定位置的字符的Unicode编码。返回值在0-65535之间的整数。

    let str = "hello world";
    str.charCodeAt(3); // 108

#### concat()

用于连接字符串。

    let str = 'hello ';
    let str2 = 'world';
    str.concat(str2); // hello world;

#### fromCharCode()

接受一个指定的Unicode值，然后返回一个字符串。

    String.fromCharCode(110,111,112,113); // "nopq"

#### indexOf()

检索字符串，返回某个指定的字符串值在字符串中首次出现的位置。传入两个参数，第一个参数必须的，跟规定需要检索的字符串值。fromindex，可选的证书参数。规定在字符串开始检索的位置，默认为0。如果检索到最后都没有，返回-1。

    let str = 'hello';
    str.indexOf('l', 3); // 3

#### lastIndeOf

从后向前检索字符串。可以返回一个指定的字符串值，最后出现的位置，在第一个字符串中的指定位置从后向前搜索。两个参数，第一个必须，规定需要检索的字符串值，第二个就是规定字符串中开始检索的位置。

    let str = 'hello';
    str.lastIndexOf('l'); // 3

#### localeCompare()

用本地特定的顺序来比较两个字符串。

    stringObject.localeCompare(target)

如果stringObject小于target， 则返回-1，如果大于target，返回+1，相等返回0.

    let str1 = 'def';
    let str2 = 'abc';
    console.log(str1.localeCompare(str2)) // 1;
    let str3 = 'ghi';
    console.log(str1.localeCompare(str3)) // -1;
    let str4 = 'def';
    console.log(str1.localeCompare(str4)); // 0

#### match()

match()方法可以在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。传入一个参数，可以是需要检索的字符串值。或者是，规定要匹配的模式的RegExp对象。如果该参数不是RegExp对象，则需要首先把它传递给RegExp构造函数，将其转换为RegExp对象。

    let str = 'hello world';
    str.match('world'); // world'
    str.match('wordd'); // null

    let str2 = '1 plus 2 equal 3';
    str.match((/\d+/g)); // 1,2,3

#### replace()

替换与正则表达式匹配的字符串。两个参数，第一个规定字符串或要替换的模式的正则表达式对象。第二个参数是一个字符串值，规定了替换文本或生成替换文本的函数。函数返回一个IE新的字符串，使用第二个参数替换了的第一个参数匹配得到的。

    let str = 'Steven is a good boy';
    str.replace(/Steven/, 'Leunggabou'); // Leunggabou is a good boy
    let str2 = 'We are young, so let's set world on fire, we can burn brighter than the sun , tonight , we are young!';
    str2.replace(/young/g, 'so young'); // 'We are so young, so let's set world on fire, we can burn brighter than the sun, tonight , we are yound!';
    let name = "Steven, Leunggabou";
    name.replace(/(w+)\s*, \s*(\w+)/, "$2 $1"); // Leungabou, Steven

#### search()

检索与正则表达式匹配的值，传入一个参数，可以是需要在stringObject中检索的子串，也可以是需要检索的RegExp对象。

    let str = 'hey jude';
    str.search(/jude/); // 4

#### slice()

提取字符串的片段，并在新的字符串中返回被提取的部分。两个参数，开始位置，结束位置。

    let str = 'hey jude';
    str.slice(3); // ' jude';

#### split()

把字符串分隔为字符串数组。首要参数是字符串或者正则表达式，从该参数指定的地方开始分隔字符串。第二个参数指定返回的数组的最大长度。

    let str = 'how are you doing today';
    str.split(" "); // how, are, you, doing, today
    str.split(''); // h,o,w, ,a,r,e,y,o,u, ,d,o,i,n,g, ,t,o,d,a,y
    str.split(' ',3); // how,are,you

#### substr()

从起始索引号提取字符串中的指定数目的字符。首要参数为需要抽取的字符串的其实下标。第二个参数就是抽取的长度。

    let str = 'hello world';
    str.substr(3); // lo world
    str.substr(3,6); // "lo wor"

#### substring()

用于提取字符串中介于两个指定下标之间的字符。第一个首要参数，规定提取的子串的第一个字符在str中的位置。

    let str = 'hello world';
    str.substring(3); // 'lo world'

#### 大小写转换

- toLowerCase(): 字符串转为小写
- toUpperCase(): 字符串转化为大写

    let str = "hello World";
    str.toLowerCase(); // hello world
    str.toUpperCase(); // HELLO WORLD

那么今天的总结就到这，希望大家能有所收获。