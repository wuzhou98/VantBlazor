"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroyNotification = exports.removeNotification = exports.addNotification = exports.createNotificationContainer = exports.initNotification = exports.delElementFrom = exports.addElementTo = exports.delElementFromBody = exports.addElementToBody = exports.getAbsoluteLeft = exports.getAbsoluteTop = exports.addDomEventListenerToFirstChild = exports.addClsToFirstChild = exports.getFirstChildDomInfo = exports.BackTop = exports.log = exports.blur = exports.focus = exports.copy = exports.matchMedia = exports.addDomEventListener = exports.getBoundingClientRect = exports.getDomInfo = exports.getDom = void 0;
function getDom(element) {
    if (!element) {
        element = document.body;
    }
    else if (typeof element === 'string') {
        element = document.querySelector(element);
    }
    return element;
}
exports.getDom = getDom;
function getDomInfo(element) {
    var result = {};
    var dom = getDom(element);
    result["offsetTop"] = dom.offsetTop || 0;
    result["offsetLeft"] = dom.offsetLeft || 0;
    result["offsetWidth"] = dom.offsetWidth || 0;
    result["offsetHeight"] = dom.offsetHeight || 0;
    result["scrollHeight"] = dom.scrollHeight || 0;
    result["scrollWidth"] = dom.scrollWidth || 0;
    result["scrollLeft"] = dom.scrollLeft || 0;
    result["scrollTop"] = dom.scrollTop || 0;
    result["clientTop"] = dom.clientTop || 0;
    result["clientLeft"] = dom.clientLeft || 0;
    result["clientHeight"] = dom.clientHeight || 0;
    result["clientWidth"] = dom.clientWidth || 0;
    result["absoluteTop"] = getAbsoluteTop(dom);
    result["absoluteLeft"] = getAbsoluteLeft(dom);
    return result;
}
exports.getDomInfo = getDomInfo;
function getBoundingClientRect(element) {
    var dom = getDom(element);
    return dom.getBoundingClientRect();
}
exports.getBoundingClientRect = getBoundingClientRect;
function addDomEventListener(element, eventName, invoker) {
    var callback = function (args) {
        var obj = {};
        for (var k in args) {
            obj[k] = args[k];
        }
        var json = JSON.stringify(obj, function (k, v) {
            if (v instanceof Node)
                return 'Node';
            if (v instanceof Window)
                return 'Window';
            return v;
        }, ' ');
        invoker.invokeMethodAsync('Invoke', json);
    };
    if (element == 'window') {
        window.addEventListener(eventName, callback);
    }
    else {
        var dom = getDom(element);
        dom.addEventListener(eventName, callback);
    }
}
exports.addDomEventListener = addDomEventListener;
function matchMedia(query) {
    return window.matchMedia(query).matches;
}
exports.matchMedia = matchMedia;
function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    }
    catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
}
function copy(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}
exports.copy = copy;
function focus(selector) {
    var dom = getDom(selector);
    dom.focus();
}
exports.focus = focus;
function blur(selector) {
    var dom = getDom(selector);
    dom.blur();
}
exports.blur = blur;
function log(text) {
    console.log(text);
}
exports.log = log;
function BackTop(element) {
    var dom = document.getElementById("BodyContainer");
    dom.scrollTo(0, 0);
}
exports.BackTop = BackTop;
function getFirstChildDomInfo(element) {
    var dom = getDom(element);
    return getDomInfo(dom.firstElementChild);
}
exports.getFirstChildDomInfo = getFirstChildDomInfo;
function addClsToFirstChild(element, className) {
    var dom = getDom(element);
    if (dom.firstElementChild) {
        dom.firstElementChild.classList.add(className);
    }
}
exports.addClsToFirstChild = addClsToFirstChild;
function addDomEventListenerToFirstChild(element, eventName, invoker) {
    var dom = getDom(element);
    if (dom.firstElementChild) {
        addDomEventListener(dom.firstElementChild, eventName, invoker);
    }
}
exports.addDomEventListenerToFirstChild = addDomEventListenerToFirstChild;
function getAbsoluteTop(e) {
    var offset = e.offsetTop;
    if (e.offsetParent != null) {
        offset += getAbsoluteTop(e.offsetParent);
    }
    return offset;
}
exports.getAbsoluteTop = getAbsoluteTop;
function getAbsoluteLeft(e) {
    var offset = e.offsetLeft;
    if (e.offsetParent != null) {
        offset += getAbsoluteLeft(e.offsetParent);
    }
    return offset;
}
exports.getAbsoluteLeft = getAbsoluteLeft;
function addElementToBody(element) {
    document.body.appendChild(element);
}
exports.addElementToBody = addElementToBody;
function delElementFromBody(element) {
    document.body.removeChild(element);
}
exports.delElementFromBody = delElementFromBody;
function addElementTo(addElement, elementSelector) {
    getDom(elementSelector).appendChild(addElement);
}
exports.addElementTo = addElementTo;
function delElementFrom(delElement, elementSelector) {
    getDom(elementSelector).removeChild(delElement);
}
exports.delElementFrom = delElementFrom;
/************ Notification start ************/
function getNotificationService() {
    return window.notificationService;
}
function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}
function removeEnterClass(element) {
    var newClassName = element.getAttribute("class").split(" ").map(function (item) {
        return item.trim();
    }).filter(function (item) {
        return item !== "ant-notification-fade-enter" && item !== "ant-notification-fade-enter-active";
    }).join(" ");
    element.setAttribute("class", newClassName);
}
function removeNotificationHandler(id, element) {
    if (!element) {
        element = document.querySelector("#" + id);
    }
    element.className += " ant-notification-fade-leave ant-notification-fade-leave-active";
    window.setTimeout(function () {
        element.parentNode.removeChild(element);
    }, 500);
    getNotificationService().invokeMethodAsync("NotificationClose", id);
}
function initNotification(notificationService) {
    window.notificationService = notificationService;
}
exports.initNotification = initNotification;
function createNotificationContainer(htmlStr) {
    var element = htmlToElement(htmlStr);
    document.body.appendChild(element);
}
exports.createNotificationContainer = createNotificationContainer;
function addNotification(htmlStr, elementSelector, id, duration) {
    var container = getDom(elementSelector);
    var spanContainer = container.children[0];
    var element = htmlToElement(htmlStr);
    spanContainer.appendChild(element);
    window.setTimeout(function () {
        removeEnterClass(element);
    }, 500);
    var timeout;
    if (duration && duration > 0) {
        timeout = window.setTimeout(function () {
            removeNotificationHandler(id, element);
        }, duration * 1000);
    }
    element.addEventListener("click", function () {
        getNotificationService().invokeMethodAsync("NotificationClick", id);
    });
    var btn = element.querySelector(".ant-notification-notice-btn");
    if (btn) {
        btn.addEventListener("click", function (e) {
            window.clearTimeout(timeout);
            removeNotificationHandler(id, element);
            e.preventDefault();
            e.stopPropagation();
        });
    }
    element.querySelector(".ant-notification-notice-close")
        .addEventListener("click", function (e) {
        window.clearTimeout(timeout);
        removeNotificationHandler(id, element);
        e.preventDefault();
        e.stopPropagation();
    });
}
exports.addNotification = addNotification;
function removeNotification(id) {
    var element = document.querySelector("#" + id);
    removeNotificationHandler(id, element);
}
exports.removeNotification = removeNotification;
function destroyNotification() {
    var allContainer = document.querySelectorAll(".ant-notification");
    for (var i = allContainer.length - 1; i > -1; i--) {
        var container = allContainer[i];
        container.parentNode.removeChild(container);
    }
}
exports.destroyNotification = destroyNotification;
/************ Notification end ************/ 
//# sourceMappingURL=interop.js.map