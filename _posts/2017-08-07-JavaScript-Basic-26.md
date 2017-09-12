---
layout: post
title: 前端核心知识（34）————JavaScript正则表达式（第三部分）
date: 2017-08-07
tags: [JavaScript]
---

今天继续来讲一下JavaScript的正则表达式相关知识。

## 正则的属性 

reg.ignorecase: 检测是否有i。

reg.global: 检测是否有g。

reg.multiline: 检测是否有m。

reg.source: 正则源字符。

reg.lastindex：很重要 待会讲。

## 正则的方法

1.reg.exec(): 很重要，待会讲。

2.reg.test()：检测是否跟目标正则匹配。

3.str.match(): 返回匹配的字符串。 返回的是一个类数组。（只展示索引位，数组方法splice），如果有g属性，就会额外返还几个属性，第一个属性是匹配到的字符串，第二个是第一个字表达式匹配到的第一个字符串，第三个匹配到第二个字符串，，index属性就是匹配位置。input就是该字符串。如果没有g属性就只能有匹配到的字符串。


4.str.serach(): 检测匹配到的字符串的索引.可以填字符串，也可以填正则。

5.str.split(): 分割字符串，利用正则。正则表达式表示空：(/d{0}/);
  
  str.split(/\d{0}/);//空截取
  
6.str.replace: 如果直接写字符串，没有全局找的功能，只能把第一个匹配到的东西进行替换。填正则表达式，利用g就可以进行全局匹配。

	var str = "abcda";
	str.replace("a","s") // "sbcda"
	str.replace(/a/g,"x") //“xbcdx”
	
7.反向引用：括号表示一个子表达式，“\1”表示引用之前的第一个子表达式匹配到的东西。
	
	var reg = /(\w)\1/;
	var str = "bb";
	var str1 = "aaaabbbbbcccc";
	var reg2 = /(\w)\1+/g;
	reg.test(str) ;// true;
	reg2.test(str1); // true

例一：1，匹配“xyyx”形式的字符串,2，调换字符串顺序 3,形式转换“abbba”转化为“baaab”

1.
	var str = "abba";
	var reg = /(\w)(\w)\2\1)/g;
	str.match(reg) //[abba];

2.
	var str = "aabb";
	var reg = /(\w)(\w)/g;
	str.replace(reg,"$2$2$1$1") //"bbaa";
	
3.
	var str = "abbba";
	var reg = /(\w)(\w)\2{2}\1/g;
	str.replace(reg,"$2$1$1$1$2");
	
注意反向引用只能反向引用子表达式。$1表示第一个子表达式，$2表示第二个子表达式，如此类推。

replace方法第二个参数还可以填一个function() ，它会自动给我们传参，第一个参数是正则表达式匹配到的完整项，第二个参数是第一个字表达式匹配到的东西，第三个参数传进第二个字表达是匹配到的东西。

例二：将字符串转化形式，the-first-name转化为小驼峰式。（toUpperCase()转大写）

	var str = "the-first-name";
	var reg = /-(\w)/g
	str.replace(reg,function ($,$1){
		return $1.toUpperCase()
	}))


## exec方法（ 执行 完成 履行）

reg.exec(str): 如果没有g，跟match是一样的。如果有g属性，它就不一样了。它有个特点就是会接着上次的匹配结果再执行。就像有一个游标存在，匹配一次，游标就移动一次。匹配完之后，他会继续循环匹配。该游标属性就是lastIndex。看以下例子：
	
	var str = "the-first-name";
	var reg = /(\w)(\w)/g;
	console.log(reg.lastIndex);  // 0
	console.log(reg.exec(str));  //["-fi", "f", "i", index: 3, input: "the-first-name"]
	console.log(reg.lastIndex);  //6 从第六位开始匹配
	console.log(reg.exec(str));  //["-fi", "n", "a", index: 9, input: "the-first-name"]
	console.log(reg.lastIndex);  //12
	console.log(reg.exec(str));	 //null
	console.log(reg.lastIndex);	 //0
	console.log(reg.exec(str));  //["-fi", "f", "i", index: 3, input: "the-first-name"]
	console.log(reg.lastIndex);  //6
	
从哪个位置开始匹配，是由lastIndex决定的。如果手动将lastIndexOf变成12，那么下次就是匹配reg.exec(str)就是null。

"?:" ： 表示忽略此子表达式。例如：要求把第一个x添加到后面。
	
	var str = "xbcy";
	var reg = /(?:abc|(\w)bc)y/g
	str.replace(reg, function ($,$1){
		return $ + $1;
	})

"?:"告诉引擎，不要将后面的内容记录为表达式。

正向预查：添加一个修饰条件，必须符合一定条件才能被匹配到。
	
	var reg = /abc(?=x)/  //匹配x后面的abc
	var reg = /(?=x)abc/  //匹配空后面是x加abc，这个是永远不可能的，所以正向预查得写后面。


如果想使用$ 这个字符串，不能直接用$,要这样写“$$”,如果想匹配“?”，需要这要转义一下"/\?/"。

例一：连续字符串去重。
	
	var str = "aaaaabbbbbcccccaaaa";
	var reg = /(\w)\1*/g;
	str.replace(reg,"$1");   // abca

例二：将字符串按规定打点。三位打点。
	
	var str = "100000000";
	var reg = /(?=(\B)(\d{3})+$)/g; //空后面跟3的倍数位的数字而且该数字是非单词边界，从后往前查，以空后面跟的数字结尾
	str.replace(reg,"."); // 100.000.000

例三：写一个邮箱验证的正则。
	
	var input = document.getElementsByTagName('input')[0];
	input.onchange = function() {
		var str = input.value;
		var reg = /^[0-9A-z]{6,18}$/g;
		if(!reg.test(str)){
			console.log("please check your e-mail");
		}else{
			console.log("smart people!");
		}
	}
	
好吧，今天的内容就讲到这。明天就回校了。。。好好学习，争取找到好工作！！！









