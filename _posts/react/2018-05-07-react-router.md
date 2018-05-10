---
layout: post
title: react-router中hashHistory与browserHistory区别
date: 2018-05-07
tags: [react]
---

对于使用hashHistory来说，浏览器上看到的url会是这样的:/#/user/haishanh?_k=fdfadfasdf

对于browserHistory浏览器看到的是这样的: /user/haishanh

对于browserHistory需要服务端支持。而是用hashHistory的时候，因为url中的#符号存在，从/#/到/#/user/.....浏览器并不会去发送一次请求，react-router会根据url去渲染对应的模块。

而使用browserHistory的时候，浏览器/到/user/haishanh是会向服务端server发送request的。所以server是要做特殊配置的。如果只想去掉？后面的东西，可以使用外部的history模块。

    import {createHashHistory} from 'history';
    const appHistory = useRouterHistory(createHashHistory)({queryKey: false});
    ReactDOM.render(
        <Router history={appHistory}>
            {routes}
        </Router>,
        document.getElementById('app');
    )

这样就没以后问号后面的东西了，URL会整洁一点。