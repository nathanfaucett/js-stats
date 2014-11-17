var utils = require("utils"),
    each = require("each"),
    $ = require("jquery"),
    page = require("page"),
    urlPath = require("url_path"),
    PolyPromise = require("promise"),
    template = require("template"),
    router = require("./router"),
    request = require("request");


var requestOptions = {
    headers: {
        "Content-Type": "text/plain"
    }
};


function templateCache(url, settings) {
    var cache = templateCache.cache,
        defer = PolyPromise.defer();

    if (!cache[url]) {
        request.get(urlPath.join(page.base(), url), null, requestOptions).then(
            function(response) {
                cache[url] = template(response.data, null, settings);
                defer.resolve(cache[url]);
            },
            function(response) {
                defer.reject(response);
            }
        );
    } else {
        defer.resolve(cache[url]);
    }

    return defer.promise;
}
templateCache.cache = {};


function render(ctx, next) {
    var locals = {};

    locals.each = each;
    locals.utils = utils;

    ctx.locals = locals;

    ctx.templateCache = templateCache;
    ctx.render = function render(selector, url, locals, callback) {
        locals = utils.mixin(locals || {}, ctx.locals);

        templateCache(url).then(
            function(template) {
                $(selector).html(template(locals));
                callback();
            }
        ).catch(callback);
    };

    next();
}


module.exports = render;
