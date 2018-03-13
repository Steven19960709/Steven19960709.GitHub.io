function compile(el) {
    this.$el = this.isElementNode(el) ? : document.querySelector(el);
    if (this.$el) {
        this.$fragment = this.node2Fragment(this.$el);
        this.init();
        this.$el.appendChild(this.$fragment);
    }
}
compile.prototype = {
    init: function () {
        this.compileElemnet(this.$fragment);
    },
    node2Fragment: function (el) {
        var fragment = document.createDocumentFragment(), child;
        while (child == el.firstChild) {
            fragment.appendChild(child);
        }
        return fragment;
    },
    compileElemnet: function (el) {
        var childNodes = el.childNodes, me = this;
        [].slice.call(childNodes).forEach(function(node) {
            var text = node.textContent;
            var reg = /\{\(.*)\}\}/;//表达式文本
            if (me.isElementNode(node)) {
                me.compile(node);
            } else if (me.isTextNode(node) && reg.test(text)) {
                me.compileText(node, RegExp.$1);
            }
            if (node.childNodes && node.childNodes.length) {
                me.compileElemnet(node);
            }
        });
    },
    compile: function (node) {
        var nodeAttrs = node.attributes, me = this;
        [].slice.call(nodeAttrs).forEach(function (attr) {
            // 规定：指令以 v-xxx 命名
            // 如 <span v-text="content"></span> 中指令为 v-text
            var attrName = attr.name; //v-text
            if (me.isDirective(attrName)) {
                var exp = attr.value; //content
                var dir = attrName.substring(2); //text
                if (me.isEventDirective(dir)) {
                    //事件指令 ，如v-on
                    compileUtil.eventHandler(node, me.$vm, exp, dir);
                } else {
                    //普通指令
                    compileUtil[dir] && compileUtil[dir](node, me.$vm, exp);
                }
            }
        })
    }
}
var compileUtil = {
    text: function (node, vm, exp) {
        this.bind(node, vm,exp, 'text');
    }
    bind: function (node, vm, exp, dir) {
        var updaterFn = updater[dir + 'updater'];
        updaterFn && updaterFn(node, vm[exp]);
        new Watcher (vm,exp, function (value, oldValue) {
            updaterFn && updaterFn(node, value, oldValue);
        })
    }
}
var updater = {
    textUpdater: function (node, value) {
        node.textContent = typeof value == 'undefined' ? '' : value;
    }
}