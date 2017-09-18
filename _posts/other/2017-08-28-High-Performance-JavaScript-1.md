---
layout: post
title: 读高性能JavaScript笔记（1）
date: 2017-08-28
tags: [JavaScript,share]
---

今天开始看高性能，把重要的内容post上来，方便以后review一下。

## 加载和执行

### 脚本位置

JavaScript一个重要的特性就是，阻塞特性。浏览器在执行JavaScript代码的时候，不能同时做其他任何事情。实际上，多数浏览器使用单一的进程来处理用户界面（UI）刷新和JavaScript脚本执行，所以同一时刻只能做一件事。JavaScript执行过程耗时越久，那么浏览器等待响应的时间就越长。这就涉及到一个渲染顺序和加载顺序，于是就有script标签的位置问题了。

首先由于脚本会阻塞页面，所以，我们就不能把script放在head里面，因为，body都还没渲染出来，script里面选择的dom元素就根本不存在。
	
	script：里面：
	var p = document.getElementById('hh');//报错，c因为p是null
	p.style.background = "red";
	body里面是：
	<p></p>

那么如果放在body头部，也是一样的，因为还没有解释到p标签，脚本就开始执行了。

于是乎，就把script放在底部，但是，主要原因是因为每个script文件下载和执行都是需要时间的，那么，如果放在body头部，展示页面会有很明显的延迟，用户看到的是一片空白，另外，script下载也是会阻塞页面的其他资源的下载，因此，所有的script标签都得放在body底部，因尽量减少整个页面的下载的影响。

### 组织脚本

每个script标签都会有两个步骤，加载（http请求），，，执行，，，加载，，，执行，那么如果有多个script文件，那么就会有多个这样的步骤，。换个想法，一个100kb的文件，要比4个25kb的文件来的更快些，所以，我们需要减少页面外链脚本文件的数量。

第二个就是，可以将多个script文件打包成一个script文件，那么只要提交一个请求，就可让多个script同时加载了。例如有个雅虎提供的合并处理器，它可以把一个指定文件合并处理后的URL来获取任意数量的YUI文件。

## 无阻塞脚本

这个无阻塞脚本就有点像咱们上课说的异步加载js，它是想，在页面中逐步加载JavaScript文件，这样，在某种程度上就不会阻塞浏览器。

### 延迟加载 defer

defer属性是由html4 中为script定义的一个扩展属性，defer属性，指明本元素所含的脚本不会修改DOM，因此代码能安全滴延迟执行。html5中引入了async属性，也适用于异步加载js的，区别在于执行时间，async是加载完成之后，自动执行的，而defer需要等待页面完成后执行，即等到dom加载完成。当读到有defer属性的script标签时，页面不会阻塞，会继续向下读，比异步加载该文件。请看一下代码：
	
	<script defer>
		alert('defer'>
	</script>
	 <script>
	 alert('script')
	 </script>
	 <script>
		 window.onload = funciton(){
			 alert('load');
		 }
	 </script>

发现，打印顺序是script---defer---load，这里要注意的是，带有defer属性的脚本，并不是跟在第二个后面执行，而是在window的onload事件处理器执行之前被调用。所以就会打印出该结果。

### 动态脚本元素

利用操作dom方法来动态的添加脚本，例如：
	
	var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'file1.js';
    document.getElementsByTagName('head')[0].appendChild(script);

这个创建的script元素加载了一个file1.js文件，文件在该元素添加到页面的时候开始下载。这种技术重点在于：

>无论何时启动加载，文件的加载和执行过程不会阻塞页面其他进程。

使用动态脚本节点下载的文件，返回的代码通常会立刻执行。这个时候，有个注意的点，如果该文件是类似于jQuery的文件，是提供接口的，我们需要跟踪并确保脚本下载完成并且准备就绪。可以利用script一个load事件来实现。
	
	script.onload = function(){
		do some things
	};
	
IE支持另一种实现方式，它会触发一个readystatechange事件。script元素提供一个readyState属性，它的值在外链文件的下载过程不同阶段发生变化，我们只需要关注两个状态：loaded和complete，两者满足其一即可。最后我们来个完整的函数。

	function loadScript(url) {
		var script = document.createElement('script');
		script.src = url;
		document.body.appendChild(script);
		if(script.readyState){
			script.onreadystatechange = function () {
				if(script.readyState == "complete" || script.readyState == "loaded"){
					test();
				}
			}
		}else{//Safari firefox goole chrome opera
			scripte.onload = function () {
				test();
			}
		}
	}
	loadScript('dome.js');
	
这里还有一个注意的点就是，每个script可能不是按照我们期望的加载顺序来执行，那个先返回，就先执行那个，这个有时候并不是我们想要的，于是我们可以这样：
	
	loadScript('file1.js',function(){
		loadScript('file2.js',function(){
			loadScript('file3.js'.function(){
				loadScript('file4.js',function(){
				//do somethings
				}
			}
		}
	}

这样就可以按照我们的期望来实现加载执行了，但是有个问题就是，文件多了，就不好管理，这个时候最后我们把多个文件都合并一下，然后一次性获得代码。

### XMLHTTPRequest 脚本注入

这个名字听得很高上大，其实就是利用ajax请求资源，而且还不能跨域，所以这个知道有这么一回事就行了，想了解的可以到我之前讲的ajax里面去看哇。

# 数据存取

计算机科学中，一个经典问题就是通过改变数据的存储位置来获得最佳的读写性能，数据存储的位置关系到代码执行过程中的检索速度。先介绍一下JavaScript的基本数据存取位置。

字面量：字面量只代表本身，不能存储在特定的位置。JavaScript中的字面量有：字符串，数组，布尔值，数组，对象，函数，正则以及特殊的null和undefined。

本地变量：开发人员使用关键字var定义的数据存储单元。

数组元素：存储在JavaScript数组对象内部，以数字作为索引。

对象成员：存储在JavaScript对象内部，以字符串作为索引。

经过测试，字面量和局部变量，减少数组项和对象成员的使用，可以提升运行速度。

## 管理作用域

每个函数都会有一个内部属性[scope]大家都知道，这个是用来存放作用域的，它决定哪些数据就能被函数访问。每次定义一个新函数，该函数就可以得到它父级的作用域，并且，在她执行的时候，创建自己的上下文，当函数执行完毕，盖上下文就被销毁。

那么，访问变量的时候，它是先在自己的上下文寻找，如果没有就会到它的父级函数的作用域去找，最后到全局中找。这样就可以找到一个性能的问题的，如果层次很深，有很多级，作用域链很长，那么它寻找变量的时候，也会很耗时间，整个过程就是影响了性能。

为了解决这个问题，我们首先要知道，全局变量是在作用域链的最末端，因此它是最远的，所以在读取全局变量的时候，速度就越慢。所以这里提升性能的方法就是：

>尽量使用局部变量，通常，在函数中被应用一次以上，那么就直接把它存储的局部就可以了，例如：
	
		function init(){
			var div = document.getElementById('div1');
			var div2 = docuemnt.getElementById('div2');
		}
		
这里的document是全局的对象，搜索这个变量需要遍历整个作用域链，这个时候，我们可以在函数里面操作一下：
	
	var doc = document;
	var div = doc.getElementById('div1');
	..........

这样就比之前的更快了。

另外就是，禁用with！！禁用with！！禁用with！！ 因为它把作用域链都改了！！它创建了一个新的对象，被推入的作用域链最顶端，所用的局部变量处于二级作用域中，访问局部变量的时候，还要在过一次作用域，所以，代价更大，这个了解一下就行。反正我们也不用with。

那么今天的内容就先讲到这，希望大家能有所收获！！！




