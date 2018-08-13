---
layout: post
title: JavaScript加载时间线
date: 2017-08-04
tags: [JavaScript]
---

这篇文章就讲一个内容，就是js加载时间线。

## JavaScript 加载时间线

js时间线是一个过程。包括了js从开始到结束整个过程，执行顺序是我们关心的重点。

1、创建Document对象，开始解析web页面。解析HTML元素和他们的文本内容后添加Element对象和Text节点到文档中。这个阶段document.readyState 是loading。（状态位）

2、遇到link外部css，创建线程加载，并继续解析文档

3、遇到img等，先正常解析dom结构，然后浏览器异步加载src，并继续解析文档。（先解析完，后加载完）

4、遇到外部js，并且设置async，defer浏览器加载，浏览器创建线程加载，并继续解析文档。对于async属性的脚本，脚本加载完成后立即执行。

5、遇到script外部js，并且没有设置async、defer，浏览器加载，并阻塞，等待js加载完成并执行该脚本，然后继续解析文档。

6、当文档解析完成，document.readyState = 'interactive'（活跃，越来状态是loading，告诉我们已成型，可以修改）。（DOM树刚刚解析完毕）

7、文档解析完成后，所有设置有defer的脚本会按照顺序执行。（注意与async的不同,但同样禁止使用document.write()）;

8、文档解析完毕后，document对象触发DOMContentLoaded事件（系统的方式，没有句柄方式，只用addEventListener能绑定这个事件。），这也标志着程序执行从同步脚本执行阶段，转化为事件驱动阶段（事件监听机制，DOM树解析完成就可以相应事件了）。

9、当所有async的脚本加载完成并执行后、img等加载完成后，document.readyState = 'complete'，window对象触发load事件。

10、从此，以异步响应方式处理用户输入、网络事件等。

要注意的是，任何情况都禁止使用document.write()，因为它能够清除文档流（如果文档流没有加载完毕，不会清楚，而是跟着加载了的文档后面），所有标签都清除。

	<div></div>
	<script>
		console.log(document.readyState);//loading
	</script>
	<span></span>
	<script>
		console.log(document.readyState);//loading script 也是标签，这里不是interactive
	</script>

说一下DOMContentLoaded这个事件，它是系统上的事件，只有addEventListener才能绑定这个事件。这个事件跟window.onload事件有异曲同工的感觉。利用它我们可以操作一些解析完就执行的操作。比window.onload更快，因为肯定是解析完毕比加载完毕更快。
	

好吧，那么今天就讲到这里。希望大家能有所收获。晚安！！



















