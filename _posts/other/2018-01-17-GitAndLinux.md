---
layout: post
title: Git和Linux常考
date: 2018-01-17
tags: [Git, Interview]
---

## Git方面［考查对Git以及分支概念的理解，利于理解Agile产品］

基础：

简单介绍一下git 简单介绍一下使用git提交代码的过程

    git add xxx 
    git commit -m "xxx"  
    git push origin master
    
1. svn和git的区别

- Git是分布式的，SVN是集中式的:Git有远端仓库,本地仓库，暂存区(Index)，工作区，而SVN只有远端仓库和本地。
- Git分支和SVN的分支不同:分支在SVN中只是版本库中的另外的一个目录，Git不是复制版本库的内容，仅仅是创建一个指向最后一次提交的可变指针.
- Git没有一个全局的版本号，SVN有:目前为止这是跟SVN相比Git缺少的最大的一个特征。
- Git的log在本地:OffLine状态下可以看到所有的Log[git fetch 拉到本地的],SVN不可以。
等等...

2.git fetch和git pull的区别

get pull = get fetch + get merge

git fetch:取得远程数据库的最新历史记录。HEAD仍然指向本地之前的commit

git pull:拉取远程数据库的最新历史记录，并和本地的暂存区和工作空间做合并。HEAD指向最新的的commit

3.git分支了解吗？分支的作用以及使用场景

基本操作：
- 新建分支：git branch $newBranch          
- 切换分支：git checkout $branch

场景与作用：

并行开发多个任务...

- 实质：

新建分支：新创建一个指向commit的指针，而非全部文件的拷贝

切换分支：HEAD指针指向分支

- 进阶:

如何处理远端最新提交与本地代码冲突

- 第一步：git stash   把所有的修改临时保存起来
- 第二步：git pull
- 第三步：git stash pop   把临时保存的修改合并
- 第四步：手动解决冲突

	不冲突部分

	<<<<<<< HEAD
	本地修改
	=======
	远端修改
	>>>>>>> 6853e5ff961e684d3a6c02d4d06183b5ff330dcc
	不冲突部分

- 第五步：git add $CONFLICT_FILE

4.merge rebase区别

merge是在本地的commit下新提交一个合并(merge)的commit信息,HEAD指针指向新的commit。

rebase是将本地拉分支的commit或者合并的commit重置为远端最新的commit，HEAD仍然指向本地的commit。

看图：
merge:[产生了分叉]
     +−−−− (E)−−−−(F)−−−−−−−−−−−−−−−−
    /                                \
(A) −− (B) −−−−−−−−(C) −− (D)−−−−−−−−−−(G − merge commit)  
                                          |
                                       developBranch 
rebase:[保持了线性提交，避免了分叉]
(A) −− (B)−−−−−−− (E) −− (F) −−−−−−− (C') −− (D') 
                                          |
                                        developBranch
gerrit了解吗？

Gerrit实际上一个Git服务器，它为在其服务器上托管的Git仓库提供一系列权限控制，以及一个用来做Code Review是Web前台页面。当然，其主要功能就是用来做Code Review。

## linux基础［考查上机器查询日志能力］

基础

基本命令考查,cp,mv,rm等

程序运行起来是个黑盒子，我们如果想知道程序运行状态，最简单的办法就是打印日志，请问如何查看日志文件。

cat  vim  tail less等等

2.如果想实时监控日志呢？

	tail -f $fileName

3.如果想查看日志中某个关键字呢？vim 底行模式下使用?

grep

4.如果一个日志文件特别大，还可以用vim吗？如果不能，要怎么办？

不能使用,vim会把文件加载到内存中，严重情况下会引起事故。

使用less替代，不会把所有内容加载到内存

使用grep缺点在于不能查看关键字所处的上下文信息，大多数我们还是需要查看上下文的

5.Linux是一个多用户的操作系统，如何查看文件或者目录的权限信息，如何更改权限？

命令：ls -al

	权限信息：
	d         rwx             rwx                 rwx
	|          |               |                   |
	文件属性   所属用户权限   所属用户组权限         其他用户权限
	
- “－”：无该权限
- “r”：对文件读取内容，对目录查看结构
- “w”：可写权限
- “x”：对于文件可以被系统执行，对于目录，是否可以cd

更改：chmod  [chown：更改文件所属用户和用户组]

- 分数表示法：chmod  xyz file
           xyz:x代表所有者的分数,y代表用户组的分数,z代表其他人的分数
           分数:r-4,w-2,x-1

- 符号表示法：chmod [options] who operator permission file-list 
          who:   u:所属用户 g:用户组 o:其他用户 a:所有用户
          operator: +:添加 -:删除 =:设置 
          permission: r-读,w-写,x-可执行
6.进阶

7.如何查看Linux机器的CPU负载情况？

使用top命令，实时显示系统中各个进程的资源占用状况。

	load average参数：一段时间（1分钟，5分钟，15分钟）内平均负载，队列长度，(Load是对当前CPU工作量的度量)
	当CPU核数为n的时候，当load=n的时候，说明已经没有资源执行额外的任务了。

8.ssh命令的使用

	解释：Secure Shell，安全外壳协议，建立在应用层基础上的安全协议

	基本使用：ssh user@host [command]
	
