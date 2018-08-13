---
layout: post
title: JavaScript DOM操作（增删改查）和基本编程练习
date: 2017-07-30
tags: [JavaScript]
---

今天继续分享一下DOM的知识。

## DOM结构树 

<img src="http://os310ujuc.bkt.clouddn.com/blog10.PNG">

DOM结构树的依赖关系是原型关系。Document下面有一个HTMLDocument，Element下面有个HTMLElement，其实可以把它们每一层看做一个构造函数，下面的每一节都是可以看做由上一级构造出来的。

	HTMLDocument.prototype.abc = "123";
	document.abc  //"123" 类似于原型的继承

它们的终端就是Node，Document下面一个子集是xmldocument（少用没有写出）和HTMLDocument，而HTMLDocument。它就是html文件中document的构造器。

CharacterData：下面构造出文本和注释。

Element：构造出html元素，包括各种head标签，body 元素等，它们的元素都继承自对应的父级的方法，意思是，HTMLheadelement的方法，只能允许HeadElement使用，其他元素节点不可以使用。

如果所用节点都能使用的方法，需要定义在Node上。Node的原型链终端指向我们熟悉的Object。

## 方法详解 查！

1.getElementById方法定义在Document.prototype上，意思就是document下的所有元素的都能使用，其他层级下就不行，例如Element节点上不能使用。

2.getElementsByName方法定义在HTMLDocument.prototype上，即非html中的document以外不能使用(xml document,Element)；

3.getElementsByTagName方法定义在Document.prototype 和 Element.prototype上

	var ul = document.getElementsByTagName('ul')[0];
	var li = ul.getElementsByTagName('xxx')[0]

4.HTMLDocument.prototype定义了一些常用的属性，body,head,分别指代HTML文档中的<body><head>标签。

	document.body  //直接能用
	document.head  // 直接能用

5.Document.prototype上定义了documentElement属性，指代文档的根元素，在HTML文档中，他总是指代<html>元素

	docuent.documentElement  //特指html

6.getElementsByClassName、querySelectorAll、querySelector在Document,Element类中均有定义


## 增 删

整个网页一旦运行，认为是不能干预的，这时候，我们就可以通过DOM对html进行操作了。动态创建节点。

1.增加节点。
	
	var div = document.createElement('div');//增加元素节点;;
	var text = document.createTextNode('this is text'); // 增加文本节点
	var comment = document.createComment('this is comment');//增加注释节点
	var abc = document.createElement('abc');//(可以自定义，但是没有意义)

2.插入节点。当我们创建了一个节点，这时候不会显示出来，当我们插入document的时候才能显示出来。

1.appendChild();父级调用，在该父级最后面插入元素。   

	docuemnt.body.appendChild(div); 
	div.appendChild(span);
	span.appendChild(text);
	span.appendChild(comment);
	
要注意的是appendChild操作还具备剪切功能，可以从一个父级剪切到另外一个父级。

2.insertBefore;  格式：document.insertBefore(p,span),在span之前插入p标签，它也是剪切功能。

3.删除节点，parent.removeChild(),child,remove();

parent.removeChild(),有父级调用，删除一个节点之后，返回该节点，这个时候，如果拿一个变量进行接收，可以重复利用，这时候相当于剪切。

child.remove() ,子级调用，直接删除，从文档结构中消失。没有返回结果。

4.替换节点

parent.replaceChild(new,old),父级调用，用新的还旧的节点。



## 节点属性

### Element节点属性

innerHTML: 往某个元素节点里面插入内容，可读可写。要用字符串形式

	div.innerHTML = "abc";
	div.innerHTML = "<span style='width:100px;height:100px;color:f40;'>hhh</span>";
	
innerText/textContent(区别在于是否留白）: 往元素节点添加文本，它会把之前的内容全部覆盖，这个多数使用查询，轻易不使用添加功能。（火狐不兼容innerText，但是有textContent方法，老版本IE没有textContent）


### 获取属性方法

div.setattribute():设定属性，在节点上添加行间属性。第一个属性，第二个为属性值。有则改之无则添加。这个很好用，我们可以通过改class名，来简介修改class样式，前期状态和后期状态来回切换。
	
	.demo{
		width:100px;
		height:100px;
		color:red;
	}
	.demo1{
		width:100px;
		height:100px;
		color:green;
	}
	div.setAttribute('class','demo')


div.getAttribute():查找属性。就是简单滴查找属性而已。。。参数传的就是想查找到属性。


## 基本DOM编程练习

1.遍历元素节点树（在原型链上编程）；

	function retChildren(node){
		var child = node.childNodes;
		var len = child.length;
		var arr = [];
		for (var i = 0; i < len; i++){
			if(child[i].nodeType === 1){
			arr.push(child[i]);
			}
		}
		return arr;

	}

拿出一层树，循环遍历父节点，求子节点的的子节点，层层递归即可。

2.封装函数，返回元素e的第n层祖先元素。
	
		<div>
		    <strong>
			<em>
			    <span>123<span>
			</em>
		    </strong>
		</div>

		var span = document.getElementsByTagName('span')[0];
		function retParent(e,n){
			while(e || n){ //如果n太大，e为null，为了兼容，先判断e是否存在。
				e = e.parentElement;//寻找父节点,并赋值给自己，下一圈循环直接使用。
				n --;
			}
			return e;
		}

3.封装函数，返回元素e的第n个兄弟节点，n为正，返回后面的兄弟节点，n为负，返回前面的，n为0，返回自己。

	function retSibling(e,n){//兼容IE
		var nodeSibling = e;
		while (nodeSibling && n){//利用循环控制圈数
			if (n>0) {
				if(nodeSibling.nextElementSibling){
					nodeSibling = nodeSibling.nextElementSibling;
				}else{
					for(nodeSibling = nodeSibling.nextElementSibling;  nodeSibling && nodeSibling.nodeType !== 1; nodeSibling = nodeSibling.nextElementSibling);
				}//利用for循环执行流程解决，判断是否为Element节点，而且判断存在的时候才能赋值（因为存在null的情况）
				n --;
			}else{
				if (nodeSibling.previousElementSibling) {
					nodeSibling = nodeSibling.previousElementSibling;
				}else{
					for(nodeSibling = nodeSibling.previousElementSibling; nodeSibling && nodeSibling.nodeType !==1;nodeSibling = nodeSibling.previousElementSibling);
				}
				n ++;
			}
		}
	}

4.编辑函数，封装children功能，解决以前部分浏览器的兼容性问题

判断元素节点，非元素节点扔掉。

	Element.prototype.myChildren = function () {
		var myChildNodes = this.childNodes,
			len = myChildNodes.length,
			arr = { //高级写法 仿一个类数组
				length : 0,
				splice : Array.prototype.splice,
				push : Array.prototype.push,
			};
		for(var i = 0; i < len; i++){
			if(myChildNodes[i].nodeType == 1){
				arr.push(myChildNodes[i]);
			}
		}
		return arr;
	}

5.自己封装hasChildren()方法，不可用children属性

	Element.prototype.myChildren = function () {
		var myChildNodes = this.childNodes,
			len = myChildNodes.length;
		for(var i = 0; i < len; i++){
				if(myChildNodes[i].nodeType == 1){
				    return true;
				}
			}
		return false;
	}



那今天的内容就更新的到这里，大家晚安！！！










