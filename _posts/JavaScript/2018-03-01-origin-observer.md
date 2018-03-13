---
layout: post
title: 原生实现数据绑定Obj.defineProperty()
date: 2018-03-01
tags: [JavaScript]
---

将JS模型与HTML视图对应，能够减少模版编译时间同时提高用户体验，使用原生JS实现双向绑定。

## Object.defineProperty()

这个方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回这个对象。

	    Object.defineProperty(obj, prop, decriptor)
	
- obj: 操作对象
- prop: 要定义或者修改的属性名称
- descriptor: 将被定义或修改的属性描述符

### 属性描述符

对象里目前存在的属性描述符有两种主要形式：数据描述符和存储描述符。数据描述符是一个具有值得属性，该值可能是可写的，也有可能是不可写的。访问其描述符由getter-setter函数对描述的属性，描述符必须是这两种形式之一；不能同时是两者。

两者同时具有以下可选键值：

configurable: 当且仅当该属性的configurable为true时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除，默认为false。

        var o = {};
		Object.defineProperty(o, 'a', {
		    get: function () {
			    return 1;
			},
			configurable: false
		})
		// throws a typeError
		Object.defineProperty(o, 'a', {
		    configurable: true
		}); 
		//throws a tyepError
		Object.defineProperty(o, 'a', {
		    enumerable: true
		});
		// throws a typeError (set was undefined previously)
		Object.definedProperty(o, 'a', {
		    set: function () {
			    return 1;
			}
		});
		// throws a typeError (even though the new get doess exactly the sanme thing)
		Object.defineProperty(0, 'a', {
		    set: function () {}
		});
		//throws a typeError
		Object.defineProperty(o, 'a', {
		    value: 12
		});
		console.log(o.a);
	    delete o.a; // Nothing happens
		console.log(o.a); //logs 1	

enumerable：当且仅当该属性的enumberable为true时，该属性才能够出现在对象的枚举属性中。默认为false。即能否使用for...in循环和Object.keys()中被枚举

    	var o = {};
		Object.defineProperty(o, 'a', {
		    value: 1,
			enumerable: true
		});
		Object.defineProperty('o', 'b', {
		    value: 2,
			enumerable: false
		});
		Object.defineProperty(o. 'c', {
		   value: 3,
		   //此时 enumerable 默认为false
		});
	    o.b = 4;// 如果使用直接赋值的方式创建对象的属性，这个属性的enumerable为true
		for (var in o) {
		    console.log(i);
		}
		//打印出‘a’和‘d’
		Object.keys(o); ['a', 'd']
		o.propertyIsEnumerable('a'); // true
		o.propertyIsEnumerable('b'); // false
		o.propertyIsEnumerable('c'); // false
		
以下是数据描述符可选键值：

- value：该属性对应的值，可以是任何有效的JavaScript值（数值，对象，函数等）。默认为undefined。
- writable：当且仅当该属性的writable为true时，value才能被赋值运算符改变。默认为false。

以下是存取描述符可选键值：

- get：一个给属性提供getter的方法，如果没有getter则为undefined。该方法返回值被用作属性值。默认为undefined。
- set: 一个给属性提供setter的方法，如果没有有setter则为undefined。该方法将接受唯一参数，并将该参数的新值分配给该属性。默认为undefined。

如果一个描述符不具有value,writable,get 和 set 任意一个关键字，那么它将被认为是一个数据描述符。如果一个描述符同时有(value或writable)和(get或set)关键字，将会产生一个异常。

    var obj = {};
	var descriptor = Object.create(null); //没有继承属性
	//默认没有enumerable，没有configurable，没有writable
	descriptor.value = "static";
	Object.defineProperty(obj, 'key', descriptor);
	//显式
    Object.defineProperty(obj, 'key', {
	    enumerable: false,
		configurable: false,
		writable: false,
		value: 'static'
	});
	//循环使用同一对象
	function withValue(value) {
	    var d = withValue.d || (
		    withValue.d = {
			    enumerable: false,
				writable: false,
				configurable: false,
				value: null
			}
		);
		d.value = value;
		return d;
	}
	//... 并且 ...
	
	Object.defineProperty(obj, 'key', withValue('static'));
	(Object.freeze || Object) (Object.prototype);
	
### 创建属性

		var obj = {}; 
		Object.defineProperty(obj, 'a', {
				value: 37,
				writable: true,
				enumerable: true,
				configutrable: true
		});
		//对象obj拥有了属性a，值为37
		//在对象中添加一个属性与存储描述符的实例
		var bValue;
		Object.defineProperty(o, 'b', {
				get: funtion () {
					return bValue;,
				},
				set: function(newValue) {
					bValue = newValue;
				},
				enumerable: true,
				configurable: true
		})
		obj.b = 38;
		//对象obj拥有了属性b，值为38
		//o.b的值现在总是BValue相同除非重新定义obj.b
		//数据描述符和存取描述符不能混合使用
		Object.defineProperty(o, 'conflict', {
				value: 12345
				get: funciton () {
					return 54321;
				}
		});
		//throws a TypeError: value appears only in data descriptors, get appears only in accessor descriptors

### 一般的Setters和Getters

实现一个自存档对象，当设置temperature属性时，archivve数组会获取日志条目。

    function Archiver () {
	    var temperature = null;l
		var archive = [];
		Object.defineProperty(this, 'temperature', {
		    get: function () {
			    console.log('get!');
				return temperature;
			},
			set: function (value) {
			    temperature = value;
				archive.push({
				    val: temperature
				});
			}
		});
		this.getArchive = function () {
		    return archive;
		};
	}
	var arc = new Archiver() ;
	arc.temperature; //'get';
	arc.temperature = 11;
	arc.temperature = 13;
	arc.getArchive(); // [{ val: 11 }, { val: 13 }]
	
















