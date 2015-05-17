define(function () {
    var $ = {};
    // 简单的query
    $.find = function (selector) {
        var selector = selector.trim(),
            result = [],
            dom = document.body,
            temp = [];   //存放上一次query得到的节点数组

        //被空格分隔的查找项的数组
        var list = selector.split(/\s+/);

        //遍历数组
        var each = function (arr, func) {
            for (var i in arr) {
                func(arr[i], i);
            }
        };

        //调用函数，依次处理指定元素节点及其子元素节点
        var walk_dom = function (node, func) {
            if (node.nodeType === 1) {
                func(node);
            }
            
            node = node.firstChild;
            while (node) {
                walk_dom(node, func);
                node = node.nextSibling;
            }
        } 

        var findClass = function (node, class_name) {
            walk_dom(dom, function (node) {
                if (node.className) {
                    var classList = node.className.split(/\s+/);
                    each(classList, function (item) {
                        if (item == class_name) {
                            result.push(node);
                        }
                    });
                }
            });
        }

        var findAttr = function (node, attr) {
            if (attr.indexOf('=') !== -1) {
                var value = attr.match(/(\[\S+])=(\S+\])/);
                walk_dom(dom, function (node) {
                    if (node.getAttribute(value[1]) == value[2]) {
                        result.push(node);
                    }
                });
            } else {
                var attrName = attr.match('/\[(\S+)\]/')
                walk_dom(dom, function (node) {
                    if (node.getAttribute(attrName[1])) {
                        result.push(node);
                    }
                });
            }
        };
        // 针对普通标签元素的查找
        var findEle = function (dom, selector) {
            var array = dom.getElementsByTagName(selector);
            result = Array.prototype.slice.call(array, 0);
        }

        function query(dom, selector) {
            var tag = selector.slice(0,1),
                item = selector.slice(1);        

            switch (tag) {
                case '#':
                    result.push(document.getElementById(item));
                    break;
                case '.':
                    findClass(dom, item);
                    break;
                case '[': 
                    findAttr(dom, selector);
                    break;
                default:
                    findEle(dom, selector); 
            }

            return result;   
        }

        //开始搜索
        if (list.length > 1) {
            //最开始，缓存数组只包含 document.body
            temp.push(dom);

            each(list, function(select_name, i) {
                result = [];  //清空result，存放新的正确元素结点
                each(temp, function (node) {
                    query(node, select_name);
                });
                temp = result;
            });
        } else {
            query(dom, selector);
        }

        // 结果为一个元素，则将其返回
        if (result.length == 1) {
            return result[0];
        }
        return result;
    };


    // 给一个element绑定一个针对event事件的响应，响应函数为listener
    $.addEvent = function (element, event, listener) {
        if (element.addEventListener) {
            element.addEventListener(event, listener, false);
        } else if (element.attachEvent) {
            element.attachEvent("on"+event, listener);
        } else {
            element["on"+event] = listener;
        }
    }

    // 获取事件对象
    $.getEvent = function (event) {
        return event ? event : window.event;
    };

    // 阻止冒泡
    $.stopPropagation = function (event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    }

    // 移除element对象对于event事件发生时执行listener的响应
    $.removeEvent = function (element, event, listener) {
        if (element.removeEventListener) {
            element.removeEventListener(event, listener, false);
        } else if (element.detachEvent) {
            element.detachEvent("on"+event, listener);
        } else {
            element["on"+event] = null;
        }
    }; 

    //绑定事件fn到对象obj
    $.bind = function (obj, fn) {
        return function () {
            return fn.apply(obj, arguments);
        }
    }; 

    return {
        $: $
    };
});
