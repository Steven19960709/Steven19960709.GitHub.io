Watcher.prototype = {
    get: function (key) {
        Dep.target = this;
        this.value = data[key]; //这里会触发属性的getter，从而添加订阅者
        Dep.target = null;
    }
}
function Watcher (vm, exp, cb) {
    this.cb = cb;
    this.vm = vm;
    this.exp = exp;
    //这里为的是触发属性的getter从而在dep添加自己，结合Observer理解
}
Watcher.prototype = {
    update: function () {
        this.run()
    },
    run: function () {
        var value = this.get(); //取到最新值
        var oldVal = this.value;
        if (value !== oldVal) {
            this.value = value;
            this.cb.call(this.vm, value, olcVal); //执行Compile中绑定回调，更新视图
        }
    },
    get: function () {
        Dep.target = this;
        var value = this.vm[exp]; //触发getter,添加自己到属性订阅器中
        Dep.target = null;
        return value;
    }
}

// Observer中的相关代码，方便理解
Object.defineProperty({
    get: function () {
        {
            Dep.target && dep.addDep(Dep.target);
            return val;
        }
    }
})    
Dep.prototype = {
    notify: function () {
        this.subs.forEach(function (sub) {
            sub.update(); //调用订阅者的update方法，通知变化
        })
    }
}