---
layout: post
title: 构建工具
date: 2018-04-12
tags: [project]
---

这篇文章主要是做一二归纳关于不同的构建工具。

## Gulp

gulp是一个基于流的自动化构建工具，除了可以管理和执行任务，还支持监听文件，读写文件。只通过下面的5个方法即可支持几乎所有的场景：

    - gulp.task: 注册一个任务
    - gulp.run: 执行任务
    - gulp.watch: 监听文件的变化
    - gulp.src：读取文件
    - gulp.dest：写文件

gulp的最大特点就是引入了流的概念，同时提供了一系列的常用的插件处理流，流可以在插件之间传递：

    const gulp = require('gulp');
    const jshint = require("gulp-jshint");
    const sass = require("gulp-sass");
    const concat = require("gulp-concat");
    let urigy = require("gulp-uglify");
    gulp.task("sass", function () {
        gulp.src("./sass/*.scss');
        // scss 插件将scss文件编译成css文件
        .pipe(sass())
        //输出文件
        .pipe(gulp.dest("./css"));
    });
    //合并压缩JavaScript文件
    gulp.task("scripts", function () {
        gulp.src('./js/*.js');
        .pipe(concat("all.js"))
        .pipe(urlify());
        .pipe(gulp.dest("./dist"));
    })
    // 监听文件的变化
    gulp.task("watch", function () {
        gulp.watch("./scss/*.scss", ["sass"]);
        gulp.watch("./js/*.js", ["scripts"]);
    })

## webpack

webpack是一个打包模块化JavaScript工具，在webpack里一切文件皆模块，通过loader转换文件，通过plugin注入钩子，最后输出有多个模块组合成的文件。webpack专注与构建模块化项目。

一切的文件JavaScript，css，图片，模版对于webpack来说都是一个个模块，这样的好处是能清晰的描述各个模块之间的依赖关系，以便方便webpack对模块进行组合和打包，经过webpack的处理,最后输出浏览器能够使用的静态资源。

Webpack具有很大的灵活性，能配置处理文件的方式，使用方法大致如下：

    module.exports = {
        entry: "./app.js",
        output: {
            filename: "bundle.js"
        }
    }

优点：

- 专注于处理模块化的项目，可以开箱即用，一步到位。
- 可以通过plugin扩展，完整好用，灵活
- 使用场景不限于web'开发
- 社区活跃


