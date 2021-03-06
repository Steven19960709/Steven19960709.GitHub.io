---
layout: post
title: 词典
date: 2018-05-21
tags: [ADT]
---

## 字典

通过一种形象生动的方式，可以访问到对应的数据。寻秩访问（vector），寻位置访问（list），寻关键码访问（BST），那么对于字典这种数据结构，则属于寻值访问(call by value)。这种典型的技巧称之为hashing（哈希，散列）。

### 数组

假设现在的场景：为一所学校制作电话簿，通过号码找到对应的个人或者办公室。

可以使用数组，按照电话号码索引，这样可以通过任意一个电话号码找到对应的个人，复杂度为O(1)。但是从空间复杂度来说为，实际的有用数据非常小，这样会造成效率非常低下。

这样，我们需要进行一下改进，将其变成散列。介绍一些概念：

- bucket，桶：直接存放或间接指向一个词条。
- 桶数组bucket array/散列表hash table，容量为M。

<img src="http://os310ujuc.bkt.clouddn.com/dic.png">

为了提高效率，M应该尽可能与N同阶。同时，M需要远小于R。

做过空间压缩之后，如果要确定目标词条的方法，称之为hashing，这个时候，需要先确定一个散列函数：hash().

通过hash确定一个散列表中的一个桶单元，最后确定目标词条。

### 散列

回到电话簿的场景，对于任何一个关键码，散列函数都能将它影射到对应的单元。对于散列表，其空间效率主要取决于N和M的比值，称为创填因子。

<img src="http://os310ujuc.bkt.clouddn.com/dic1.png">

#### 冲突

对于两个不同的关键码，被影射到同一个桶单元，称之为散列冲突（hash collision），这个时候可以通过增长散列表，降低装填因子，但是不能从根本上解决这个冲突问题。

所谓的散列函数，就是一个较大的取值域影射到一个小的取值域。对于冲突问题，只能通过合理结构进行降低冲突概率。

### 散列函数

已知冲突是无法杜绝的。在一般的实际应用中，我们可以得到类似的单射。我们需要精心设计散列表和散列函数，以尽可能降低冲突的概率。制定可行的预案，以便发生冲突时能够尽快予以排解。

对于一个散列函数：

- 必须具有确定性，同一个关键码总是被影射回到同一地址。
- 快速，能够快速对现，O(1)最好。
- 满射，尽可能充分地覆盖整个散列空间
- 均匀uniformity：关键码映射到散列表个位置的概率尽量接近。可有效避免聚集clutering现象

#### 整数留余法

之前的取模的方法就是留余法。为什么要取90001呢？计算效率比较高。发生冲突概率小。

<img src="http://os310ujuc.bkt.clouddn.com/dic2.png">

当M为素数的时候，数据对散列表的覆盖最充分，分布最均匀。

#### MAD法

除余法的缺陷：无论表长M取值如何，总有hash(0) = 0，

零均匀，[0,R)的关键码，平均分配至M个桶，但是相邻关键码的散列地址也比相邻。

一阶均匀：临近的关键码，经过散列函数之后，散列地址不在临近。

如果想要更高阶的均匀性，我们可以使用MAD(multiply-add-divide)方法，取M为素数，a > 0, b > 0, a % M 不等于0.

首先做一次乘法，然后做一次取余。 

    hash(key) = (a * key + b) % M;

#### 其他hash函数

- 数字分析selecting digits法，抽取key中的某几位，构成地址，比如取十进制表示的技术无。

- 平方取中法，先算出关键码的平方，然后去中间的若干位构成地址。

<img src="http://os310ujuc.bkt.clouddn.com/dic3.png">

- 折叠法，按照最终散列地址的宽度，将key分割为等宽的若干端，取总和作为地址。

<img src="http://os310ujuc.bkt.clouddn.com/dic4.png">

- 位异或法：将key分割成等宽的二进制端，经过异或运算得到地址。

<img src="http://os310ujuc.bkt.clouddn.com/dic5.png">

总是随机，就是越好。

- （伪）随机数法

<img src="http://os310ujuc.bkt.clouddn.com/dic6.png">

循环：根据确定的公式，将取值范围以内的整数，进行计算。对应于某个特定秩，有一定的地址。每一个伪随机数发生器，都能看作一个散列函数。但是，具体平台，不同的历史版本，可能会对应不同的随机数发生器，这样就可能有不同的散列表，所以这点需要谨慎使用。

- 多项式法

对于每个key（字符串型），需要先转化为hashCode，最后在转化为bucket address。

<img src="http://os310ujuc.bkt.clouddn.com/dic7.png">

方法：

多项式法转换，对每个key进行转化，最后转化为地址。复杂度为O(n)

### 冲突排解

一旦发生冲突，应该怎样进行排解？

#### 多槽位

<img src="http://os310ujuc.bkt.clouddn.com/dic8.png">

将每个桶单元继续细分为4个槽位，每个槽位用来存放词条。只要每个桶中，槽位不多，仍然可以保证O(1)的复杂度。

#### 独立链

<img src="http://os310ujuc.bkt.clouddn.com/dic10.png">

为了解决多槽位法的缺点，我们可以使用独立链法（封闭地址策略），对于散列表中的每一个单元能够存放，而且只能够存放与K相冲突的词条，所以每个词条一开始就已经确定存放单元。

<img src="http://os310ujuc.bkt.clouddn.com/dic9.png">

#### 开放定址

<img src="http://os310ujuc.bkt.clouddn.com/dic11.png">

对于散列表中的每一个单元能够存放，而且只能够存放与K相冲突的词条，所以每个词条一开始就已经确定存放单元。很难保证空间上的毗邻。

采用开放定址进行修正。散列表所占用的空间始终是连续的，所有的冲突都在这样的一块空间排解。每一个词条都有可能放在同一个桶中，对于特定的词条，会有优先级关系进行排列。然后从这个序列出发，查找各个桶单元。一旦抵达第一个空桶，即可报告失败。

##### 查找连的查找方法： 线性试探

一旦冲突，则试探后裔紧邻空桶，每一查找链都集中在某一局部，可以减少IO，为了减少冲突，可能会导致以后跟多的冲突。

<img src="http://os310ujuc.bkt.clouddn.com/dic12.png">

##### 惰性删除

按照开放定址策略：先后插入、相互冲突的一组词条，将存放在统一查找链中。

查找连被切断，后续词条将丢失——明明存在，却访问不到。

lazy removal: 仅做删除，查找链不必删除。例如：标记R，当查到R之后，跳过这个标记，进行下一个查找。

<img src="http://os310ujuc.bkt.clouddn.com/dic13.png">

### 排解冲突2

#### 平方试探

<img src="http://os310ujuc.bkt.clouddn.com/dic14.png">

之前的基本冲突排解，基本分为封闭地址和开放定址。在性能上有一定优势，但是对于线性试探，会发生不应该的错误。归根究底，就是因为线性试探地址太靠近，这时候使用平方试探就可以解决这个问题。

所谓平方试探，就是以平方数为距离，确定下一试探单元。

相对于线性试探，确实可以是数据聚集的现象有所缓解，一旦发生冲突，可以聪明地跳离是非之地。但是如果涉及外存，平方试探可能会导致I/O激增，而且对于空桶无法利用。

#### 至多半载

当表的长度为素数时，为了使平方试探总是成功，装填因子需要少于：50%。

<img src="http://os310ujuc.bkt.clouddn.com/dic9.png">

#### 双向平方试探

一旦发生冲突，将会双向地向后试探，先后在前。

