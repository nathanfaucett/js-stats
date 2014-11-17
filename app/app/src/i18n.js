var PolyPromise = require("promise"),
    request = require("request"),
    router = require("./router");


var translations = {};


function loadTranslations(locale, callback) {
    var translation = translations[locale];

    if (!translation) {
        request.get("locale/" + locale + ".json").then(
            function(response) {
                translation = translations[locale] = response.data;
                callback(undefined, translation);
            },
            function(response) {
                callback(new Error(response.data));
            }
        );
    } else {
        callback(undefined, translation);
    }
}

function i18n(ctx, next) {
    var locale = ctx.locale || "en";

    loadTranslations(locale, function(err, translations) {
        if (err) {
            next(err);
            return;
        }

        function translate(str) {
            var strs = str.split("."),
                value = translations[strs[0]],
                length = strs.length - 1,
                i = 0;

            while (value && i++ < length) {
                value = value[strs[i]];
            }

            return value || str;
        }

        ctx.i18n = ctx.locals.i18n = translate;

        next();
    });
}


module.exports = i18n;
