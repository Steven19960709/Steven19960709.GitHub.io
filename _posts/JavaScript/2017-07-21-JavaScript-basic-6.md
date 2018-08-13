---
layout: post
title: JavaScript闭包深入理解及其作用与解决方法
date: 2017-07-21
tags: [JavaScript]
---

今天的博文很有意思，不是内容有意思，而是博主是在火车上更新的博文，很有意思，是不是？

今天要讲JavaScript很重要的知识——闭包。上一篇博文已经给大家介绍了闭包的基本概念了，今天将要跟大家继续深入地了解闭包的知识。首先我们还是来简单地复习一下基本知识吧。

      function a() { 
          var aaa = 100;
          function b() {
              console.log(aaa);
              }
           return b;'
        }
        var demo = a();
        demo();

当a函数定义的时候，产生一个执行上下文，里面有一个aaa，和一个函数b，当b定义的时候，已经含有a的劳动成果，意思就是它已经有a的执行上下文，并且在b执行的时候，产生它自己的执行上下文，最后当a函数执行完之后，把函数b返回到了全局作用域，虽然a执行完，并且销毁了它自己的执行上下文，但是因为其内部b函数的存在，仍然有a的全部执行上下文，所以，仍然可以通过demo来访问function a里面的aaa变量。

## 闭包的应用

接下来，我给大家介绍一下，闭包的应用。

### 实现公有变量

我们可以看一下以下代码：

          function add() {
             var num = 0;
             function demo(){
                num++;
                console.log(num);
                }
                return demo;
           }
          var test = add();
          test();
          test();

  
我们可以利用闭包产生一个公有变量，对于上述例子，公有变量就是num。add函数，把demo函数返回到了外部，demo函数，仍然有add函数的执行上下文，所有每次执行test的时候，就相当于执行demo函数，并且每次访问的num都是同一个num变量，这样，我们就称num就是公有变量，通过这样的操作方式，就可以利用闭包产生一个累加器了。

### 做缓存机构

再看以下代码：

            function test(){
               var num = 0;
               function a() {
                  console.log(++num);
                }
               function b() {
                  console.log(--num);
                }

                return [a,b];
        }
            var arr = test();
            arr[0]();
            arr[1]();

这段代码把a函数和b函数都返回到了外部，这样a函数和b函数都与num产生了一个闭包，并且a和b执行的都是同一个变量，当a改变num的时候，b的num也会发生改变，同理，b操作了num，a的num也会发生改变，因为它们指向的num是同一个num，这样，就相当于一个缓存，每次都是操作之前操作过的同一个变量。这个例子可能不太明显，我们再来一个例子。

    function eater() {
       var food = "";
       var obj = {
           eat : function() {
               if(food == "" ){
                   console.log('empty');
                   }else{
                       console.log("I am eating " + food);
                       food = "";
                   }
               },
               push : function (myFood) {
                   food = muFood
               }
           }
           return obj;
       }
       var eater1 = eater();
       eater1.eat();
       eater1.push('orange');
       eater1.eat();
       
 首先，函数eater把对象obj返回到了外部，并且利用eater来接收，这就相当于，把eat函数，和push函数保存到了外部，于是两个函数分别都和food产生了闭包。虽然，food执行完事之后，执行上下文都会被销毁，但是，由于已经被保存到了外部的两个函数仍然保留它的执行上下文，所以，每次都能正常调用food，下次调用的时候都是用同一个food。当我们第一次调用eat方法的时候，因为没有任何参数，所以第一次是我们empty，第二次传参的时候，因为两个操作的food都是同一个变量，于是，就打印出 “I am eating orange”,这就是利用闭包产生缓存机构。

## 立即执行函数

接下来，我们先不讨论闭包的相关知识，我们来讲一下立即执行函数。

有些数学公式，或者是其他一些常数的计算，我们没有必要把它一直放在全局的空间里，这样会很好内存，于是就诞生了立即执行函数。形如：

        (function (a,b){
            console.log(a+b);
            }(1,2) ）        // 最后面的小括号是执行符，最外层的是算术运算符

这样的形式就是一个立即执行函数，它的特点就是，当JavaScript引擎解析到这个语句的时候，就会马上执行，并且，当这个函数执行完之后，会马上把它自己的执行上下文都销毁。这样就可以释放这里的内存。立即执行函数可以有返回值，可以有形参等。

      var ret = (function (a,b){
            console.log(a + b);
            return [a,b];
            }(a,b)}

要注意的是，立即执行函数的返回值需要利用一个变量来进行接收。

## 立即执行函数的底层知识

我们把问题在研究深一点，为什么会产生这样的立即执行函数。

首先我们要知道，只有表达式才能被执行，

        function test() { }              // 函数声明，不是表达式
        
        var test = function () ;         // 函数表达式

这样，我们可以把函数声明转化成表达式。

1.+function test(){ } +号运算符，可以将函数声明转会表达式，这样就可以执行了。

+ function test() { }()

2.! function test()  可以在函数声明前加一个叹号，也是可以将生命转化为表达式。

3. (function test() { }) () 通过在函数声明最外层加一个小括号，这样也可以将函数声明转化为表达式，于是就可以马上执行了。因为优先级的关系，算数运算小括号是最高优先级，于是将会先转化为表达式之后再执行。

例子：

        function test(a,b) {
            console.log(a,b);
            }(1,2)

这种写法，是不会报错的，因为它传了参数，这样系统将会解析为这样的：

        function test(){
            console.log(a,b);
            }




            (1,2)

这样，系统认为它们是相互独立的两个部分，不会报错，这时JavaScript引擎的容错机制。



## 利用立即执行函数解决闭包的问题。

我们看一下这个典型例子：

      function test() {
          var arr = [ ];
          for(var i = 0 ;i < 10; i++){
                 arr[i] = function (){
                     console.log(i + ",");
                     }
                  }
                  return arr;
              }
          var demo = test();
          for(var j = 0; j < 10 ;j ++ ){
              demo[j]();
              }// 10 * 10 

首先,这段代码最后打印出的是10个10，我们的目的是要让它打印出0到9，显然跟我们的目标有差距。为什么呢？

首先解析一下为什么十个十，首先我们需要知道，function打印出的i并不是马上变限的，意思是，function要等到执行的时候才会去寻找i的值，这时候i的值已经是10了，因为i必须要等于10的时候才会停止循环。简单来说就是可以这样理解：返回的数组就是十个function，

	[function () { console.log(i),function () { console.log(i),function () { console.log(i),function () { console.log(i),
	function () { console.log(i),function () { console.log(i),function () { console.log(i),function () { console.log(i),
	function () { console.log(i),function () { console.log(i),function () { console.log(i),function () { console.log(i),
	function () { console.log(i)]

当数组的每一位轮圈执行的时候，i才是真正的打印结果，这时候，i就是10；

另外，打出十个十，就是我们的每一个i，用的都是同一个执行上下文的i，我们需要利用立即执行函数来解决这个问题。

         function test() {
             var arr = [];
             for(var i = 0; i < 10; i++){
                (function (j) {
                    console.log(j);
                    }(i))
                 }
                 return arr;
             }

利用立即执行函数，每次访问的i都是不一样的值，这样就可以打印出0-9了。

最后再看一个例子：

              a = 100 ;
              function demo(e) {
                 function e() {}    
                 arguments[0] = 2;
                 document.write(e);   //2 因为形参列表将e改变为2
                 if(a) {
                     var b = 123;
                     function c() { }
                 }
                 var c ;   
                 a = 10 ;
                 var a ;
                 document.write(b);  // undefined
                 f = 123;
                 docuemnt.write(c);  //function (){}
                 docuemnt.write(a); // 10
              }
              var a;
              demo(1)
              docuemnt.write(a);
              document.write(f);

最后注意一点就是 if语句定义函数是不允许的，但是var在if里面仍然是可以提升的。

OK，想不到在火车上的效率这么高，写了这么多，哈哈哈，大家晚安啦！！广东！！我回来了！！！


















  
  
  
  
