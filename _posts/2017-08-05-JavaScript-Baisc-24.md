---
layout: post
title: 前端核心知识（33）———— JavaScript 正则表达式（第一部分）
date: 2017-08-05
tags: [JavaScript]
---

今天我们来讲一下编程里面一个很重要的知识————正则表达式

## 正则表达式

正则表达式，人为的设定一些方法，用来处理字符串的，匹配某种特定的字符串。正则表达式，代表一定的规则。


### 铺垫

转义字符“\”：在一些特定的情况，我们需要在页面显示一些回车，反斜杠等，这个时候就需要用转义字符了。例如：

"abc\n"： 表示abc之后换行.在控制台可以显示出来。

其他用处，\t 表示table； \r 表示行间字符 ；\n 表示换行。

又有，如果我们想打印出双引号等特殊符号，就可以写成这样：
	
	var str = " abc\"bc\"bd"';//"abc"bc"bd";
	var str2 = "abc\\d"; //abc\d
	
如果我们想实现多行显示：
	
	var str = "\
		<div>\
			<p class="demo">123</p>\
		</div>\
	"    
	//系统会识别成文本形式的回车。

## 正则正讲

正则表达式的作用：匹配特殊字符或有特殊搭配原则的字符的最佳选择。它也是对象。

正则表达式的创建方法：

	1.var reg = new RegExp("abc");
	2.var reg1 = /abc/  (字面量形式）;
	3.var reg2 = new RegExp(reg); //就相当于重新写一个与reg一样的，但是你改，我不改
	4.var reg = RegExp(reg);  //这个写法就相当于直接引用。你改，我就改。
	
	

如果使用new的形式进行创建，第一个参数写的是正则，第二个参数表示属性（g,m,i）。通常都使用第二种方法。采用字面量的形式。

### 属性

i: ignore;忽略。如果在正则表达式写i属性，表示忽略大小写。

	var reg = /abc/;
	var reg1 = /abc/i;
	var str ="ABC";
	reg.test(str);  //false
	reg1.test(str); //true
	
g: global;全局；匹配到一个之后，会继续匹配，返回一个类数组。

	var reg = /abc/g;
	var str = "abcquweabcdabc";
	str.match(reg); //[abc,abc]

m: mutiple; 多行匹配;针对多行，行首识别。

	var reg = /^ab/;
	var reg1 = /^ab/m;
	var str = "abddsd\nabccds";
	str.match(reg);  //[abddsd]; 换行之后就不再匹配；注意，g也识别不了换行。
	str.match(reg1); // [abddsd,abccds]、换行之后继续匹配。

### 表达式

表达式，定义匹配的规则。一个表达式只匹配一位。

/[abc][cd]/: 第一位匹配abc任意一位，第二位匹配cd任意一位。方括号里面的表示区间。
	
	var reg = /[abc][cde][xyz]/;
	var str = "qweooiracy";
	str.match(reg) //["acy"];

/0-9]: 表示匹配数字：0-9；

/^abc] : 匹配任何不是abc的字符；

/[a-z]/:匹配小写a到z；

/[A-z]/:匹配大写A到小写z；

/[A-Z]/:匹配所有大写字母；

/(aa|bb|cc)/ : 表示一个子表达式，先匹配括号里面的表达式。

正则表达式的第一部分就先讲到这，大家晚安！！


	









