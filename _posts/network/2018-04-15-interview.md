---
layout: post
title: The different between TCP and UDP
date: 2018-04-15
tags: [network]
---


## TCP UDP 基本区别

- 基于连接与无连接
- TCP要求系统资源较多，UDP较少；
- UDP程序结构比较简单
- tcp为流模式，udp为数据报模式
- tcp保证数据正确性，udp可能丢包
- tcp保证数据顺序，udp不保证

### UDP应用场景

- 面向数据方式
- 面向数据大多数为短消息
- 拥有大量的client
- 对数据安全性无特殊要求
- 对网络负担非常重，但对相应要求要求高
-
### 具体编程时的区别

- socket() 参数不同
- UDP Server 不需要调用listen和accept
- UDP收发数据用sendto/recvfrom函数
- tcp：地址信息在connect/accept时确定
- UDP: 在sendto/recvfrom函数中每次均需要指定地址信息
- UDP：shutdown函数无效

### 编程区别

通常我们在说到网络编程时默认是指tcp编程，即用前面提到的socket函数差UN宫颈癌哪一个socket用于tcp通讯，函数参数我们通常填为SOCK\_STREAM。即socket(PF\_INET, SOCK_STREAM, 0)，这表示建立一个socket用于流式网络通讯。

SOCK_STREAM这种的特点是面向连接的，即每次收发数据之前必须通过connect建立连接，也是双向的，即任何一方都可以收发数据，协议本身提供了一些保障机制保证它是可靠的、有序的，即每个包按照发送的顺序到达接收方。 

而SOCK_DGRAM这种是User Datagram Protocol协议的网络通讯，它是无连接的，不可靠的，因为通讯双方发送数据后不知道对方是否已经收到数据，是否正常收到数据。任何一方建立一个socket以后就可以用sendto发送数据，也可以用recvfrom接收数据。根本不关心对方是否存在，是否发送了数据。它的特点是通讯速度比较快。大家都知道TCP是要经过三次握手的，而UDP没有。 

#### 编程步骤区别：

那么基于编程的区别，UDP和TCP编程步骤也有区别：

##### TCP

TCP编程的服务器端一般步骤是： 

    　　1、创建一个socket，用函数socket()； 
    　　2、设置socket属性，用函数setsockopt();  可选 
    　　3、绑定IP地址、端口等信息到socket上，用函数bind(); 
    　　4、开启监听，用函数listen()； 
    　　5、接收客户端上来的连接，用函数accept()； 
    　　6、收发数据，用函数send()和recv()，或者read()和write(); 
    　　7、关闭网络连接； 
    　　8、关闭监听； 

TCP编程的客户端一般步骤是： 
    　
        1、创建一个socket，用函数socket()； 
    　　2、设置socket属性，用函数setsockopt();* 可选 
    　　3、绑定IP地址、端口等信息到socket上，用函数bind();* 可选 
    　　4、设置要连接的对方的IP地址和端口等属性； 
    　　5、连接服务器，用函数connect()； 
    　　6、收发数据，用函数send()和recv()，或者read()和write(); 
    　　7、关闭网络连接；

##### UDP
UDP:

与之对应的UDP编程步骤要简单许多，分别如下： 

    　　UDP编程的服务器端一般步骤是： 
    　　1、创建一个socket，用函数socket()； 
    　　2、设置socket属性，用函数setsockopt();* 可选 
    　　3、绑定IP地址、端口等信息到socket上，用函数bind(); 
    　　4、循环接收数据，用函数recvfrom(); 
    　　5、关闭网络连接； 

UDP编程的客户端一般步骤是： 

    　　1、创建一个socket，用函数socket()； 
    　　2、设置socket属性，用函数setsockopt();* 可选 
    　　3、绑定IP地址、端口等信息到socket上，用函数bind();* 可选 
    　　4、设置对方的IP地址和端口等属性; 
    　　5、发送数据，用函数sendto(); 
    　　6、关闭网络连接；

TCP和UDP是OSI模型中的运输层中的协议。TCP提供可靠的通信传输，而UDP则常被用于让广播和细节控制交给应用的通信传输。

### 总结

1. tcp面向连接，例如打电话要先拨号建立连接，udp是无连接的，即发送数据之前不需要建立连接

2. tcp提供可靠服务，也就是说，tcp连接传送的数据无差错，不丢失，不重复，且按序到达；而UDP尽最大努力交付，不保证可靠性

3. tcp面向字节流，实际上是tcp把数据看成一连串无结构的字节流，udp是面向报文的，没有拥塞控制，因此网络出现拥塞不会是源主机发送速率降低（对实时应用很有用，如IP电话，实时视频会议等）

4. 每一条tcp连接只能是点对点的，UDP支持一对多，一对一多对一和多对的的交互通信

5. TCP首部开销20字节；UDP首部开销小，只有8个字节

6. tcp的逻辑通信信道是全双工的，UDP则是不可靠信道