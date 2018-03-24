---
layout: post
title: 前端核心知识（31）————JavaScript JSON数据传输格式
date: 2017-08-04
tags: [JavaScript]
---

## JSON

JSON是一种传输数据的格式（以对象为样板，本质上就是对象，但是用途有区别，对象就是本地用的，json是用来传输的）。前端也是和后端统一的格式。

xml也是用来传输数据的，他可以自己定义标签，每个标签的格式就类似于对象。

	<stuent>
		<name>Steven</name>
		<age>20</age>
	</student>

但是现在xml已经不用了。主流的就是使用json。

json对象跟我们平常的对象，主要区别是属性名必须要使用双引号。

json是可以解析的，有两个方法。一般情况下，正常的数据传输都是会转化为二进制的文件或数据，多数都是字符串，我们需要对字符串进行操作。

json.parse(stjson) : 将json类型的字符串转化为json类型的对象。（把接收过来的信息转化为json）

	var stjson = '{ "name" : "xiaozhang","age" : "20"}'

另外就是，字符串不能手动写成多行，字符串必须是一行。否则会报错。

json.stringfy(json) : 将一个json转化为字符串形式。（将json转化为字符串，方便传输）

## 异步加载JS

html加载的时候是一边加载一边解析。当我们加载到script标签的时候会阻塞页面。在我们正常编程的时候，有很多script，css文件。当我们script过多的时候，有很多方法库，类库等会阻塞很久，如果有个文件发生错误，下面的所有文件都会瘫痪掉。这时候，我们需要将JavaScript文件（库文件，不用执行的方法）一部分异步加载出来，就是一边加载JavaScript一边加载html、css等。

总结一下，归于以下两点：

js加载的缺点：加载工具方法也阻塞文档，过多js加载会影响页面效率，一旦网速不好，那么整个网站将等待js加载而不进行后续渲染等工作。

有些工具方法需要按需加载，用到再加载，不用不加载。

我们需要对某些JavaScript文件，进行按需加载，需要的时候才加载，不需要的时候不加载。

### 异步加载js的方法

defer: 推迟加载，而且，下载完之后，要等到JavaScript解析完毕才能执行。属性名和属性值一样，直接写属性名即可。

	<script src="xx.js" defer>
		console.log('a');
	</script>

这样就可以变成异步加载，另外开一个线程加载js文件。但是只有IE能够使用。。

（文档解析的时候，先解析html结构和css文件，形成DOM树和css树，然后两个树拼在一起，形成渲染树randertree。然后在这个过程中有几个状态：
这里先讲一个状态，dom树解析完毕。把标签都放在DOM树上，不用看完里面的内容，就可以把它挂在树上。这就叫解析完成。在DOM树加载完毕之前是先解析完毕。
）

async: 必须使用加载外部文件的时候才能变成异步（src），下载完成之后直接执行，也是异步执行，不会阻塞页面。不能直接写在script标签里面。IE9以下不好使。

	<script async src="XX.js"></script>

我们现在看个例子：

	<script async src="demo.js"></script>//demo.js里面有test函数
	<script> test()</script>//test执行

当执行到第一个script的时候主线程会继续向下解析，并开一个新线程解析demo.js，当解析到第二个script的时候，因为不是异步的，就会阻塞所有进程，这个时候的demo.js可能已经解析完，但是没有下载完，这个时候就会报错，因为test还没有下载完就执行了。

以上两种方法不能做到按需加载，只能做到异步加载。通常开发，我们使用第三种方法。

### DOM方法

创建script，插入到DOM中，加载完毕后callBack回调。

	var script = document.createElement('script');
	script.src = "demo.js";
	document.boddy.appendChild(script);
	test() //报错，因为这个是异步加载，还没加载完就执行，报 test is not defined

这种方法可以实行按需加载，异步加载。但是这个时候，我们需要知道异步加载js的加载完成时间，告诉我们js文件已经加载完成。这个时候就有一个很人性化的方法：load事件。（IE没有load事件）

	script.onload = function () {
		//加载完之后需要进行的操作，写在里面
	}
 
 Ie上面的方法用readyState 有两个状态，loading表示正在加载，如果加载完成就会变成complete或loaded。还有一个事件就是onreadystatechange，是用来检测readystate状态的变化，如果变化了就会触发这个事件。
	
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

以上就是最常用的异步记载，按需加载的方法。但是如果下载的非常快，解析完成的时候，马上就下载完，这个时候，onreadystatechange马上变成最终状态，我们还没检测，它已经变化完毕了，所以我们需要调换一下顺序。最后才插入脚本。

		function loadScript(url) {
			var script = document.createElement('script');
			script.src = url;
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
			document.body.appendChild(script);
		}
		loadScript('dome.js');

最后要变成一个传参形式，自定义函数，注意不能直接写函数名，否则会报错。
		
		var obj = {
			test : function (){ } 
			}//写在demo.js文件里面
		function loadScript(url,callback) {
			var script = document.createElement('script');
			script.src = url;
			if(script.readyState){
				script.onreadystatechange = function () {
					if(script.readyState == "complete" || script.readyState == "loaded"){
					script.onreadystatechange = null;//降低性能，不用时刻监听
						obj[callback]();
					}
				}
			}else{//Safari firefox goole chrome opera
				script.onload = function () {
					script.onload = null; //降低性能，不用时刻监听
					obj[callback]();
				}
			}
			document.body.appendChild(script);
		}
		loadScript('dome.js',"test");

这就是完整的整个方法，实行按需异步加载。

这部分内容就讲到这，希望大家能有所收获。












































