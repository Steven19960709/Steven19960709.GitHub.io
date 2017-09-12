---
layout: post
title: 前端核心知识(23）————JavaScript DOM操作
date: 2017-07-29
tags: [JavaScript]
---

从上一篇博文开始，ECMA标准部分就已经复习完了，今天开始要分享dom的相关知识

## DOM（Document Object Model文档对象模型）

DOM定义了表示和修改文档所需的方法。DOM对象即为宿主对象，由浏览器厂商定义，用来操作html和xml功能的一类对象的集合，也有人称DOM是对html以及xml的标准编程接口。

### DOM的查找

html标签在这里开始叫做DOM节点，也可以叫做DOM对象。

铺垫：document：它代表整个文档，属于一个对象，换句话说，它代表整个文件，html根标签<html>的上级就是document。

1.document.getElementById(): 通过Id来选择DOM对象。选出来之后就可以进行操作。注意的是Ie8以下的浏览器，不区分大大小写，而且也返回匹配到的name属性的元素。意思就是如果name属性和id属性的名字相同，IE都能选出来，这是个漏洞。还有就是，通过id选出来的对象只有一个对象。

	<div id="only"></div>
	document.getElementById("only");

我们可以通过div.style.prop来查看div对象的样式。

2.document.getElementsByTagName('div'): 它能选出来一组对象，并且返回的是一个类数组。简单判断选择出来的是一个还是一组，可以看Element后面有没有s有就是一组，没有就是一个。党选出来是一组的话，想操作单个对象，就需要在后面加调用的索引：
	
	<li></li>
	<li></li>
	<li></li>
	<li></li>
	document.getElementsByTagName('li')[0]; //单独选出来第一个li元素。
	
我们可以利用这个方法来做个例题啊，很常考的，就是往每个li里面添加内容，对应每个li的下标，需要利用到的是innerHTML方法，往里面添加内容。

	var oli = document.getElementsByTagName('li');
	var len = oli.length;
	for(var i = 0; i < len; i++){
	    span[i].innerHTML = i + 1;
		span[i].style.color = "#f" + "i" + "i*5"; //每个字颜色都不一样
	}

这个还是相对简单的因为没有涉及到闭包的内容，下次涉及到在展开讲讲。

3.document.getElementsByName(): 通过name属性选元素，需要注意的是，只有部分标签name可生效，div就是没有name属性的。
	
	<input name = "abc">	
	var input = doucment.getElementsByName('abc')[0];

这个方法很少用，不过有些情况要跟后端进行数据传输的时候就需要用到。

4.getElementsByClassName()：通过类名classname来进行选择元素。注意，ie8以下的IE版本中没有。另外这个方法可以多个class一起选。

	<div class="abc"></div>
	<span class="abc"></span>
	<p class="abc"></span>
	var nodecollection = document.getElementsByClassName('abc')[1];  // 选出类名为abc的数组中的第二位元素。
	
5.document.querySeletor()选出一个和querySelector（选出一组）:选择的语法跟css高度一致，参数灵活。例如我们想选em元素而且是span的子元素。

	<div>
		<em class="abc"></em>
		<span class='abc'>
			<em class="abc">123</em>
		</span>
	</div>
	var emEle = document.querySelector("div .abc em");
	
但是本质上有一点不同就是，通过query选出来的元素，不是实时的，不会实时随着交互发生变化，一开始选出来是什么样，就是什么样，再也不会发生变化。而get方法是会随着交互一起发生改变，因此，这个方法很少用。另外，ie7及以下没有该方法。
	
## 遍历节点树（针对所有节点）

节点的种类：文本节点（空格或回车），注释节点，元素节点（标签），属性节点，document（文档节点），DocumentFragment（文档碎片节点）。

通过选中某些节点，来进行某个节点的选中。先找到父亲，再找儿子。

	<div>
		<!-- this is comment -->	
		<span>   1    </span>
		<em>2</em>
	</div>
	
div属于父节点，span和em属于子节点，它俩互为子节点。

	var span = document.getElementByTagName('span')[0];
	var div = document.getElementsByTagName('div')[0];
	span.parentNode  // <div></div>
	span.parentNode.parentNode  // <body></body>
	span.parentNode.parentNode.parentNode // <html></html>
	span.parentNode.parentNode.parentNode.parentNode //#document
	span.parentNode.parentNode.parentNode.parentNode.parentNode // null
	div.childNodes.length  // 5;文本节点（回车）注释节点+文本节点（回车）+元素节点（span）+文本节点（回车）+元素节点（em）+文本节点（回车）
	span.childNodes.length  //1,都是文本节点
	 

1.parentNode: 父节点，最顶端的parentNode为#document；

2.childNodes：子节点‘们’

3.firstChild: 第一个子节点；

4.lastChild: 最后一个子节点

5.nextSibling：后一个兄弟节点 

6.previousSibling: 前一个兄弟节点


## 基于元素节点树的遍历（针对元素节点）

parentElement: 父元素节点，注意html的父元素节点是null，因为document自成一类，不是元素节点。（IE不兼容）

children: 只返回当前元素的元素子节点。没有兼容性问题。

node.childElementCount: 它等价于node.children.length当前元素节点的个数，（IE不兼容）。

firstElementChild：返回的是第一个元素节点(IE不兼容)

lastElementChild：返回的是最后一个元素节点(IE不兼容)

nextElementSibling / previousElementSibling：返回后一个/前一个兄弟元素节点（IE不兼容)


## 节点属性 

每个节点都会有4个节点的属性。

1.nodoName：元素节点就是标签名以大写形式展示，注释节点：#comment，document节点：#document，文本节点：#text。只读！！

2.nodeValue：可读可写，但是只有注释节点和文本节点才有这个属性，能修改，能查询！

3.nodeType：这个方法很重要，有它，我们才能知道我们获取的是什么类型的节点。

ElementNode(元素节点）：1；

attributeNode（属性节点）：2；每个标签都有属性，例如class属性，style属性，当我们使用这样的代码：
	
	<div style="width:100px;height:100px;" class="demo" >
	var div = document.getElementByTagName('div')[0];
	div.attributes  // NamedNodeMap{ 0:style,1:class, length:2}
	div.attbributes[0] //style = "width:100px;height:100px;"返回一个键值对。
	div.attbributes.nodeType // 2

可以查找对应标签上的属性。这个属性是可以赋值的。大家可以有兴趣试试。



TextNode（文本节点）：3；

commentNode（注释节点）：8；

document（文档节点）：9；

DocumentFragment（文档碎片节点）：11；

其他类型的节点类型有些是针对xml而且很少用，这就不展开了。

4.hasChildNodes(): 查询是否具有子节点。注意里面是否具有回车或者空格，看看有没有文本节点。


 
 好吧，今天的分享先到这里，明天继续，大家晚安！！


















