---
layout: post
title: 网页图片优化方案
date: 2018-02-02
tags: [Interview, share]
---

很多页面中可能会包含大量的图片，图片的加载速率直接影响页面的加载速度。

常见问题：

- 图片并发太多，针对同一个域名最多完成6个请求的并发，其他的请求将会推入到队列中等待或者停滞不前，知道六个请求之一完成，队列中的新的请求才会发出。
- 部分图片体积过大导致下载图片时间过长。

### 前端解决方法

1.不是首屏展示的图片，延迟加载，先加载首屏展示的图片。

判断图片是否在首屏内图片，先想到的是通过getBoundingClientRect方法，获取到图片的位置信息，判断是否在viewport内部。

    const inViewport = (el) => {
        const rect = el.getBoundingClientRect();
        return rect.top > 0
          && rect.bottom < window.innerHeight
          && rect.left > 0
          && rect.right < window.innerWidth
    }

拓展知识：Element.getBoundingClientRect(): 返回值是一个DOMRect对象，包含一组用于描述边框的只读属性-left、top、right、和bottom，单位为像素。除了width和height外的属性都是相对于视口左上角位置而言的。

空边框盒（译者注：没有内容的边框）会被忽略。如果所有的元素边框都是空边框，那么这个矩形给该元素返回的 width、height 值为0，left、top值为第一个css盒子（按内容顺序）的top-left值。

为了跨浏览器兼容，请使用 window.pageXOffset 和 window.pageYOffset 代替 window.scrollX 和 window.scrollY。不能访问这些属性的脚本可以使用下面的代码：

    // For scrollX
    (((t = document.documentElement) || (t = document.body.parentNode))
    && typeof t.scrollLeft == 'number' ? t : document.body).scrollLeft
    // For scrollY
    (((t = document.documentElement) || (t = document.body.parentNode))
    && typeof t.scrollTop == 'number' ? t : document.body).scrollTop

但是项目中并木有用这个方法，原因在于，只有当DOM元素插入到DOM树种，并且页面进行重排重绘后，才能知道该元素是否在首屏中。在项目中通常使用v-img指令。在 Vue 指令中包含两个钩子函数 bind 和 inserted。官网对这两个钩子函数进行如下解释：

- bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
- inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。

这两个钩子函数的触发时差大约是200ms，因此如果在 inserted 钩子函数内再去加载图片就会比在 bind 钩子函数中加载晚大约200ms，在 4G 网络环境下，200ms 对于很多图片来说已经足够用来加载了，因此我们最终放弃了在 inserted 钩子函数中加载首屏图片的方案。

因此，使用预先defer的方法，把已知的需要延迟的image延迟即可。

    const promises = [];// use to save the preload image
    Vue.directive('img', {
        bind(el, binding, vnode) {
            //..
            const { defer } = binding.value
            //...
            if (!defer) {
                promises.push(update(el, binding, vnode))
            }
        },
        inserted(el, binding, vnode) {
            const { defer } = binding.value
            if (!defer) return;
            if (inViewport(el)) {
                promise.push(update(el, binding, vnode))
            }else{
                Vue.nextTick(() => {
                    Promise.all(promises)
                    .then (() => {
                            promises.length = 0;
                    update(el, binging, vnode);
                    })
                    .catch( () => {})
                })                
            }
        }
    })

首先通过声明一个数组 promises 用于存储优先加载的图片，在 bind 钩子函数内部，如果 defer 配置项为 false，说明不延时加载，那么就在 bind 钩子函数内部加载该图片，且将返回的 promise 推入到 promises 数组中。在 inserted 钩子函数内，对于延迟加载的图片（defer 为 true），但是其又在首屏内，那么也有优先加载权，在 inseted 钩子函数调用时就对其加载。而对于非首屏且延迟加载的图片等待 promises 数组内部所有的图片都加载完成后才加载。当然在实际代码中还会考虑容错机制，比如上面某张图片加载失败、或者加载时间太长等。因此我们可以配置一个最大等待时间。

针对文章开头的问题解决方案：

- 并发数的限制，可以进行 域名切分，提升并发的请求数量，或者使用HTTP/2协议。
- 图片体积过大，在保证清晰度的前提下尽量使用体积较小的图片。而一张图片的体积有两个因素决定，该图片总的像素数目和编码单位像素所需的字节数。因此一张图片的文件大小就等于图片总像素数目乘以编码单位像素所需字节数，公式如下：

    FileSize = Total Number Pixels * Bytes of Encode single Pixels

举个例子：

一张 100px * 100px 像素的图片，其包含该 100 * 100 = 10000 个像素点，而每个像素点通过 RGBA 颜色值进行存储，R\G\B\A 每个色道都有 0~255 个取值，也就是 2^8 = 256。正好是 8 位 1byte。而每个像素点有四个色道，每个像素点需要 4bytes。因此该图片体积为：10000 * 4bytes = 40000bytes = 39KB。

有了上面的背景知识后，我们就知道怎么去优化一张图片了，无非就两个方向：

- 一方面是减少单位像素所需的字节数
- 另一方面是减少一张图片总的像素个数

正如上面例子所说，RGBA 颜色值可以表示 256^4 种颜色，这是一个很大的数字，往往我们不需要这么多颜色值，因此我们是否可以减少色板中的颜色种类呢？这样表示单位像素的字节数就减少了。而「无损」压缩是通过一些算法，存储像素数据不变的前提下，尽量减少图片存储体积。比如一张图片中的某一个像素点和其周围的像素点很接近，比如一张蓝天的图片，因此我们可以存储两个像素点颜色值的差值（当然实际算法中可能不止考虑两个像素点也许更多），这样既保证了像素数据的「无损」，同时也减少了存储体积。不过也增加了图片解压缩的开销。

图片加载尺寸和实际渲染尺寸对比，根据设备的尺寸来加载不同尺寸（像素总数不同）的图片，也就是说在保证图片清晰度的前提下，尽量使用体积小的图片，问题就迎刃而解了。

使用的 lib-flexible 来对不同的移动端设备进行适配，lib-flexible 库在我们页面的html元素添加了两个属性，data-dpr 和 style。这儿我们主要会用到 style 中的 font-size 值，在一定的设备范围内其正好是html元素宽度的十分之一（具体原理参见：使用Flexible实现手淘H5页面的终端适配），也就是说我们可以通过style属性大概获取到设备的宽度。同时设计稿又是以 iPhone6 为基础进行设计的，也就是设计稿是宽度为 750px的设计图，这样在设计图中的图片大小我们也就能够转换成其他设备中所需的图片大小了。

举个例子：

设计稿中一张宽 200px 的图片，其对应的 iPhone 6 设备的宽度为 750px。我们通过 html 元素的 style 属性计算出 iPhone6 plus 的宽度为 1242px。这样也就能够计算中 iPhone6 plus 所需图片尺寸。计算如下：

    200 * 1242 / 750 = 331.2px

实现代码如下：

    const resize = (size) => {
        let viewWidth
        const dpr = window.devicePixelRatio
        const html = document.documentElement
        const dataDpr = html.getAttribute('data-dpr')
        const ratio = dataDpr ? (dpr / dataDpr) : dpr

        try {
            viewWidth = +(html.getAttribute('style').match(/(\d+)/) || [])[1]
        } catch(e) {
            const w = html.offsetWidth
            if (w / dpr > 540) {
            viewWidth = 540 * dpr / 10
            } else {
            viewWidth = w / 10
            }
        }

         viewWidth = viewWidth * ratio

        if (Number(viewWidth) >= 0 && typeof viewWidth === 'number') {
            return (size * viewWidth) / 75 // 75 is the 1/10 iphone6 deivce width pixel
        } else {
            return size
        }
    }

上面 resize 方法用于将配置的宽、高值转换为实际所需的图片尺寸，也就是说，size 参数是 iphone 6 设计稿中的尺寸，resize 的返回值就是当前设备所需的尺寸，再把该尺寸配置到图片服务器的传参中，这样我们就能够获取到按设备裁剪后的图片了。

### 最后总结

通过上面的研究及数据结果表明，新零售图片加载缓慢的优化策略：

- 首屏图片优先加载，等首屏图片加载完全后再去加载非首屏图片。
- 对大部分图片，特别是轮播广告中的图片进行按设备尺寸裁剪，减少图片体积，减少网络开销，加快下载速率。