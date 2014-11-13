var router = require("./router");


var translations = {
    en: {
        projects: {
            header: "Projects"
        }
    }
};


function i18n(ctx, next) {

    function i18n(str, locale) {
        var strs = str.split("."),
            value = translations[(locale || "en")][strs[0]],
            length = strs.length - 1,
            i = 0;

        while (i++ < length) {
            value = value[strs[i]];
        }

        return value || str;
    }

    ctx.i18n = ctx.locals.i18n = i18n;

    next();
}


module.exports = i18n;
