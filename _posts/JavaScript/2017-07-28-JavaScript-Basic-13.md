---
layout: post
title: JavaScript之数组
date: 2017-07-28
tags: [JavaScript]
---

不好意思，因为之前复习的时候，视频顺序弄错了，应该在前两篇博客中先讲的数组，我就说，为什么数组还没讲就讲了类数组，今天给补一下。

## 数组创建方法

1.数组字面量(直接量）

	var arr = [1，，2，3];

2.利用构造函数

	var arr = new Array(1,2,3,4);
	arr = [1,2,3,4]

如果只传了一位参数，代表的是数组长度:

	var arr = new Array(20)
	var arr = new Array(20.1)  //报错
	arr // [20*undefined] 空数组 长度为20
	
一般情况下都是使用数组字面量。如果想创建一个长度为20的数组，可以直接：

	var arr = [];
	arr.length = 20;

如果访问超过长度的数组属性，值是undefined。不会报错。

## 数组的方法

### 改变原数组的方法

1.arr.push(): 往数组最后面添加元素；任意个数，任意类型。

	arr.push(123,[],{})

仿写一个push方法。

	Array.prototype.push = function(target){
	    var len = this.length;
	    (this[len] = target; //一个参数)
	    for(var i = 0; i < arguments.length; i++){
	        this[this.length] = arguments[i];//多个参数
		
	}

2.arr.pop(): 从数组后面剪切一位元素，并返回该元素。不用传参数。

3.arr.shift():在前面剪切元素。

	var arr = [1,2,3];
	arr.shift();  // arr [2,3]

4.arr.unshift():在数组前面添加元素。也能传多个参数。

	var arr = [1,2,3,4];
	arr.unshift(-1,5)   //arr [1,2,3,4,5]
	arr.unshift(0)	    //arr [0,1,2,3,4]

5.arr.reverse(): 将数组的元素逆转。

6.arr.splice(): 第一个参数是开始操作位，第二个参数是剪切长度；之后的每个参数都是表示从操作位添加元素,返回的是剪切的数组。

	var arr = [1,2,3];
	arr.splice(0,2)  // arr [3]
	var arr1 = [1,2,3,4,5]
	arr.splice(2,2,0)//arr1 [1,2,0,5]
	
如果剪切长度为0，那么可以用来添加元素，这种情况更加常用。

	arr = [1,3];
	arr.splice(1,0,2,3,4);//arr [1,3,2,3,4,5]

splice方法通常用来插入数据。

7.arr.sort 这个数组方法很重要。它可以用来进行排序。

	var arr = [2,10,6,1,7,8,3];
	arr.sort() // [1,10,2,3,6,7,8] sort自己的排序方法是按照字典顺序，取每一位进行阿斯克码排序。
	
通常不会使用它自己的排序方式来进行排序。我们自定义排序，我们定义规则。关注返回值，如果返回的是正数，那么后面的数在前面，如果返回的是负数，那么前面的数在前。操作数，会将数组中的任意的两位数传到函数里面，当做a，和b，然后根据返回值，按照上述方法进行排序。

		var arr = [2,10,6,1,7,8,3];
		arr.sort(function (a,b) {
			if(a > b){
				return 1;
			}else{
				return -1;
			}
		}
		//arr [1,2,3,6,7,8,10] 正序
		arr.sort(function (a,b){
		    if(a < b){
			    return 1;
			}else{
				return -1;
			}
		}
		//arr [10,8,7,6,3,2,1]; 倒序

JavaScript引擎会将数组都遍历，确保每种情况都走过一遍，把每个元素都传进去，最后排序。
	
简写方法：

	var arr = [1,6,2,7,8]
	arr.sort(function (a,b) {
		return a-b;//正序
		return b-a;//倒序
	}


将正序的数组进行随机排序。

	var arr = [1,2,3,4,5,6,7,8];
	arr.sort(function () {
		var ret = Math.random() - 0.5;
		return ret;
	})

按照对象的某个属性进行排序：

	var arr = [{name:'steven',age:20},{name:'Jenny',age:18}]
	arr.sort(function (a,b){
		return a.age - b.age;
	}

只有这七个数组的方法能改变原数组，包括以后的ES5中的数组方法都是不能够改变原数组的。

### 不能够改变原数组

1.arr.concat(): 对两个数组进行连接。

	var arr = [1,2,3];
	var arr1 = [2,3,4];
	var arr2 = arr.concat(arr1); // [1,2,3,2,3,4]
	
2.toString():将数组的每一位转化成字符串并返回。

	var arr = [{},2,3,4];
	arr.toString();   // "[object Object],2,3,4"

3.arr.join(): 将数组按照传进去的符号进行连接，最后转化为字符串返回。默认是逗号连接。

	var arr = [1,2,3];
	arr.join("-") // "1-2-3"

4.arr.split(): 将字符串按照传进去的符号拆分为字符串形式数组。注意它是字符串的方法。但是它跟join操作是互逆的。

	var arr = [1,2,3];
	var str1 = arr.join("-") // "1-2-3"
	str.split('-');   //["1","2","3"]

例题：用最快的方法将以下字符串拼接为字符串：“上海”，“北京”，“中山”，“深圳”，“广州”，“梅州”

第一种：
	
	var str = "";
	str += "上海"+“北京”+“中山”+“深圳”+“广州”+“梅州”；

但是这种很耗性能，因为它属于栈操作。

第二种：利用数组，堆操作

	var arr = ["上海"，"北京","中山","深圳","广州","梅州"];
	arr.join('-');


那么今天的内容就讲到这里，大家晚安！！



















