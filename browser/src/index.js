var utils = require("utils"),
    type = require("type"),
    each = require("each"),
    time = require("time"),
    request = require("request");


request.defaults.headers["Content-Type"] = "application/json";


var stats = module.exports,
    hostname = "http://api.stats.com:3000",

    NativeXMLHttpRequest = (
        global.XMLHttpRequest ||
        function XMLHttpRequest() {
            var xhr;

            try {
                xhr = new ActiveXObject("Msxml2.XMLHTTP.6.0");
            } catch (e1) {
                try {
                    xhr = new ActiveXObject("Msxml2.XMLHTTP.3.0");
                } catch (e2) {
                    throw new Error("XMLHttpRequest is not supported");
                }
            }

            xhr.setRequestHeader = function setRequestHeader(key, value) {

                (xhr.__requestHeaders__ || (xhr.__requestHeaders__ = {}))[key] = value;
            };

            xhr.addEventListener = function addEventListener(name, fn) {
                var events = xhr.__events__ || (xhr.__events__ = {}),
                    eventList = events[name] || (events[name] = []);

                if (type.isFunction(fn)) {
                    eventList.push(fn);
                }
            };

            xhr.removeEventListener = function removeEventListener(name, fn) {
                var events = xhr.__events__ || (xhr.__events__ = {}),
                    eventList = events[name] || (events[name] = []),
                    index = utils.indexOf(eventList, fn);

                if (index !== -1) {
                    eventList.splice(index, 1);
                }
            };

            xhr.dispatchEvent = function dispatchEvent(name, data) {
                var events = xhr.__events__ || (xhr.__events__ = {}),
                    eventList = events[name] || (events[name] = []),
                    i = -1,
                    length = eventList.length - 1,
                    event;

                while (i++ < length) event.call(xhr, data);
            };

            return xhr;
        }
    ),
    supportsEventListener = type.isNative(NativeXMLHttpRequest.prototype.addEventListener);


NativeXMLHttpRequest.prototype.nativeSetRequestHeader = NativeXMLHttpRequest.prototype.setRequestHeader;
NativeXMLHttpRequest.prototype.setRequestHeader = function setRequestHeader(key, value) {

    (this.__requestHeaders__ || (this.__requestHeaders__ = {}))[key] = value;

    return this.nativeSetRequestHeader(key, value);
};


function capitalize(str) {
    return type.isString(str) ? utils.trim(str[0].toUpperCase() + str.slice(1).toLowerCase()) : "";
}

function toHeaderString(str) {
    return each.map((str || "").split("-"), capitalize).join("-");
}

function parseResponseHeaders(responseHeaders) {
    var headers = {},
        raw = responseHeaders.split("\n");

    each(raw, function(header) {
        var tmp = header.split(":"),
            key = tmp[0],
            value = tmp[1];

        if (key && value) {
            key = toHeaderString(key);
            value = utils.trim(value);

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
        data = {},
        started = false;

    function onreadystatechange(e) {
        var statusCode = +xhr.status,
            readyState = +xhr.readyState;

        if (!supportsEventListener) {
            xhr.dispatchEvent("readystatechange", e);
        }

        if (readyState === 1) {
            if (started === false) {
                data.start = time.stamp();
                started = true;
            }
        } else if (readyState === 4) {
            if (!supportsEventListener) {
                if ((statusCode > 199 && statusCode < 301) || statusCode === 304) {
                    xhr.dispatchEvent("load", e);
                } else {
                    xhr.dispatchEvent("error", e);
                }
            }

            data.statusCode = statusCode;
            data.url = xhr.responseURL;

            data.responseHeaders = type.isFunction(xhr.getAllResponseHeaders) ? parseResponseHeaders(xhr.getAllResponseHeaders()) : {};
            data.requestHeaders = utils.copy((type.isObject(xhr.__requestHeaders__) ? xhr.__requestHeaders__ : {}));
            data.userAgent = navigator.userAgent;

            data.end = time.stamp();
            data.delta = data.end - data.start;

            data.env = stats.env();

            request.post(stats.url() +"/requests", data);
        }
    }

    if (supportsEventListener) {
        xhr.addEventListener("readystatechange", onreadystatechange);
    } else {
        xhr.onreadystatechange = onreadystatechange;
    }

    return xhr;
}

global.XMLHttpRequest = XMLHttpRequest;


stats.set = function(apiKey, projectId, env) {
    var url = hostname +"/projects/"+ projectId;

    env || (env = "production");

    stats.url = function() {
        return url;
    };

    stats.env = function() {
        return env;
    };

    request.defaults.headers["X-API-Token"] = apiKey;

    return stats;
};

stats.url = function() {
    throw new Error("stats.url() call stats.set(apiKey, projectId, env) first");
};

stats.env = function() {
    throw new Error("stats.env() call stats.set(apiKey, projectId, env) first");
};

stats.log = function(log) {

    return request.post(stats.url() + "/logs", {
        date: new Date(),
        env: stats.env(),
        log: log
    });
};

stats.error = function(error, url, line) {

    return request.post(stats.url() + "/errors", {
        date: new Date(),
        env: stats.env(),
        error: type.isString(error) ? error : (error.stack || error.message || error +""),
        url: type.isString(url) ? url : location.href,
        line: type.isNumber((line = +line)) ? line : -1
    });
};
