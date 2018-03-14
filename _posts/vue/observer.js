function Observer(data) {//观察者
    // if (typeof data !== object) {
    //     return;
    // }
    this.data = data;
    this.walk(data);
}
Observer.prototype = {
    walk: function (data) {//负责将属性遍历，然后挨个绑定监听
        var me = this;
        Object.keys(data).forEach(function(key) {
            me.convert(key, data[key]);
        })
    },
    convert: function (key, val) {//绑定监听
        this.defineReactive(this.data, key, val);
    },
    defineReactive: function (data, key, val) {//降属性使用object.defineProperty进行劫持
        var dep = new Dep();
        var childObj = observe(val);//遍历属性中的子属性
        Object.defineProperty(data, key, {
            enmuberable: true,
            configurable: false,
            get: function () {
                if (Dep.target) {
                    dep.depend();
                }
                return val;
            },
            set: function (newVal) {
                if (newVal === val) {
                    return;
                }
                val = newVal;
                //新的值如果是object的话就进行监听。
                childObj = observe(newVal);
                //通知订阅者
            }
        })
    }
}
function observe(value, vm) {
    if (!value || typeof value !== 'object') {
        return;
    }
    return new Observer(value);
}

var uid = 0;
function Dep () {
    this.id = uid ++;
    this.subs = [];
}

Dep.prototype = {
    addSub: function (sub) {//往消息队列里面添加一个监听
        this.subs.push(sub);
    },
    depend: function () {
        Dep.target.addDep(this);//要与watcher里面的代码联系
    },
    removeSub: function(sub) {
        var index = this.subs.indexOf(sub);
        if (index !== -1) {
            this.subs.splice(index, 1);
        }
    },
    notify: function () {
        this.subs.forEach(function (sub) {
            sub.update();
        })
    }
}
Dep.target = null;