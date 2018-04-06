---
layout: post
title: Express 框架概述
date: 2018-04-02
tags: [node]
---

Express是一个简洁灵活的nodejs web应用框架。可以快速搭建一个完整功能的网站。核心特性为以下几点：

- 可以设置中间件来响应HTTP请求
- 定义了路由表用于执行不同的HTTP请求动作
- 可以通过向模版传递参数来动态渲染html页面

### 请求和响应

Express应用使用回调函数的参数：request和response对象来处理请求和响应的数据。

#### Request 对象

- req.app：当callback为外部文件的时候，用req.app访问express的实例
- req.baseUrl:获取路由当前安装的url路径
- req.body/req.cookies: 获取请求主体/cooki
- req.fresh/req.state：判断请求是否需要更新
- req.hostname/req.ip：获取主机名和IP地址
- req.originalUrl: 获取院士请求url
- req.params: 获取路由的parameters
- req.path：获取请求路径
- req.query：获取url的查询参数串
- req.route：获取当前匹配的路由
- req.get()：获取指定的http请求头
- req.is()：判断请求头Content-Type的MIME的类型

#### Response对象

- res.app 与req的一样
- res.append()：追加指定的http头
- res.set()在res.append（）后将重置之前设置的请求头
- res.conkie(name, value[, option]): 设置cookie，option：domian/expires/httpOnly/maxAge/path/secure/signed
- res.clearCookie(): 清除cookie
res.download(): 传送指定路径的文件
- res.get(): 返回指定的http头
- res.jsonp() : 传送jsonp响应
- res.location(): 只设置相应的locationHTTP头，不设置状态码或者close response。
- res.send()：传送http响应
- res.set(): 设置http头，传入object可以一次设置多个头
- res.status(): 设置http状态码
- res.type(): 设置Content-Type的MIME类型

### 路由

路由决定了由谁去响应客户端请求。我们通过路由取出请求的url以及get/post参数。

    const app = express();
    app.get('/', function (req, res) {
        res.send('hello get');
    })
    app.post('/', function (req, res){
        res.send('hello post');
    })
    app.get('/file', function (req, res) {
        res.send('this is file page');
    })

根据不同的src进行不通的资源交互

### 静态文件

Express提供了内置的中间件express.static来设置静态文件：图片，css，JavaScript等。

    app.use(express.static('public'));

那么这样如果我们需要访问到一些图片资源，例如输入：

    localhost/picture.jpg

如果public文件夹里面有的画，就能成功展示出来。

#### body-parser 中间件

body-parser是一个非常常用的express中间件，作用是对POST请求的请求体进行解析。

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ etended: false}));

这样就是主要的两种使用方式。

详细了解看这篇文章[Nodejs进阶：Express常用中间件body-parser实现解析](https://www.cnblogs.com/chyingp/p/nodejs-learning-express-body-parser.html);

#### multer 中间件

multer是express官方推荐的文件上传中间件，它是在busboy基础上开发的。

文件上传有以下方法：

- muilter.singer('flie'): 适用于单文件上传
- muilter.array('file',num): 适用于多文件上传，上传文件的数量可以小于num
- muilter.fields(fields),适用于混合上传，A类文件多于一个，B类文件少于一个

file为上传字段名称，当使用form表单submit方式上传时，必须与表单上传的name属性保持一致。

表单记得加上  enctype=‘multipart/form-data’

    app.post('/file_upload', function (req, res) {
        console.log(req.files[0]); //上传文件信息
        let des_file = __dirname + "/" + req.files[0].originalname;
        fs.readFile( req.files[0].path, function (err, data) {
            fs.writeFile(des_file, data, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    response = {
                        message: 'file uploaded successfully',
                        filename: req.files[0].originalname
                    }
                }
                res.end(JSON.stringify(response));
            })
        })
    })

### Cookie 管理

我们可以使用中间件向Nodejs服务器发送cookie信息

    const cookieParser = require('cookie-parser');
    const util = require('util');

    app.use(cookieParser());
    app.get('/', function (req, res) {
        console.log("Cookies:" + util.inspect(req.cookies));
    })

那么关于express就简单介绍到这里，希望大家能有所收获