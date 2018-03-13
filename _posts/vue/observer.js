function Observer(data) {
    this.data = data;
    this.walk(data);
}
Oberver.prototype = {
    walk: function (data) {
        var me = this;
        Object.keys(data).forEach(function(key) {
            me.conert(key, data[key]);
        })
    },
    convert: function (key, val) {
        this.defineReactive(this.data, key, val);
    },
    defineReactive: function (data, key, val) {
        var dep = new dep();
        var childObj = observe(val);
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

Dep.prototype - {
    addSub: function (sub) {
        this.subs.push(sub);
    },
    depend: function () {
        Dep.target.addDep(this);
    },
    removeSub: function(sub) {
        var index = this.subs.indexOf(sub);
        if (index != -1) {
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