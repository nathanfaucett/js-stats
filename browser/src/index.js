var utils = require("utils"),
    type = require("type"),
    each = require("each"),
    time = require("time"),
    request = require("request");


var NativeXMLHttpRequest = global.XMLHttpRequest || function XMLHttpRequest() {
        try {
            return new ActiveXObject("Msxml2.XMLHTTP.6.0");
        } catch (e1) {
            try {
                return new ActiveXObject("Msxml2.XMLHTTP.3.0");
            } catch (e2) {
                throw new Error("XMLHttpRequest is not supported");
            }
        }
    },
    
    NATIVE_EVENT_TARGET = type.isNative(NativeXMLHttpRequest.prototype.addEventListener),
    TRIM_REGEX = /^[\s\xA0]+|[\s\xA0]+$/g,
    triggerEvent;


request.defaults.XMLHttpRequest = NativeXMLHttpRequest;
request.defaults.headers["Content-Type"] = "application/json";


function uuid() {
    return uuid.str.replace(uuid.re, uuid.replace);
}

uuid.str = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
uuid.re = /[xy]/g;
uuid.replace = function(c) {
    var r = Math.random() * 16 | 0,
        v = c === "x" ? r : r & 0x3 | 0x8;

    return v.toString(16);
};

function trim(str) {

    return str.replace(TRIM_REGEX, "");
}

function parseResponseHeaders(responseHeaders) {
    var headers = {},
        raw = responseHeaders.split("\n");

    each(raw, function(header) {
        var tmp = header.split(":"),
            key = tmp[0],
            value = tmp[1];

        if (key && value) {
            value = trim(value);

            if (key === "Content-Length") {
                value = +value;
            }

            headers[key] = value;
        }
    });

    return headers;
}

function XMLHttpRequest() {
    var xhr = new NativeXMLHttpRequest(),
        data = {
            requestId: uuid()
        };
    
    function onreadystatechange() {
        var statusCode = +xhr.status,
            readyState = +xhr.readyState;
        
        if (readyState === 1) {
            data.start = time.stamp();
        } else if (readyState === 4) {
            if (!NATIVE_EVENT_TARGET) {
                if ((statusCode > 199 && statusCode < 301) || statusCode === 304) {
                    triggerEvent(xhr, "load", xhr);
                } else {
                    triggerEvent(xhr, "error", xhr);
                }
            }
            
            data.statusCode = statusCode;
            data.url = xhr.responseURL;

            data.responseHeaders = type.isFunction(xhr.getAllResponseHeaders) ? parseResponseHeaders(xhr.getAllResponseHeaders()) : {};
            data.requestHeaders = utils.copy((type.isObject(xhr.__requestHeaders__) ? xhr.__requestHeaders__ : {}));

            data.end = time.stamp();
            data.delta = data.end - data.start;
            
            request.post("http://localhost:3000/requests", data);
        }
    }
    
    if (NATIVE_EVENT_TARGET) {
        xhr.addEventListener("readystatechange", onreadystatechange);
    } else {
        xhr.onreadystatechange = onreadystatechange;
    }

    return xhr;
}

if (!NATIVE_EVENT_TARGET) {
    triggerEvent = function(xhr, name, data) {
        var events = xhr.__events__ || (xhr.__events__ = {}),
            eventList = events[name] || (events[name] = []),
            i = -1,
            length = eventList.length - 1,
            event;
        
        while (i++ < length) event.call(xhr, data);
    }
    
    NativeXMLHttpRequest.prototype.addEventListener = function(name, fn) {
        var _this = this,
            events = this.__events__ || (this.__events__ = {}),
            eventList = events[name] || (events[name] = []);
        
        eventList.push(fn);
    };
    
    NativeXMLHttpRequest.prototype.removeEventListener = function(name, fn) {
        var _this = this,
            events = this.__events__ || (this.__events__ = {}),
            eventList = events[name] || (events[name] = []),
            index = utils.indexOf(eventList, fn);
        
        if (index !== -1) {
            eventList.splice(index, 1);
        }
    };
} else {
    triggerEvent = utils.noop;
}

NativeXMLHttpRequest.prototype.nativeSetRequestHeader = NativeXMLHttpRequest.prototype.setRequestHeader;
NativeXMLHttpRequest.prototype.setRequestHeader = function setRequestHeader(key, value) {

    (this.__requestHeaders__ || (this.__requestHeaders__ = {}))[key] = value;
    
    return this.nativeSetRequestHeader(key, value);
};


global.XMLHttpRequest = XMLHttpRequest;
