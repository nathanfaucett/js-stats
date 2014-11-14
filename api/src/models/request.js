var orm = require("orm");


var Request = new orm.define({
    name: "Request",

    schema: {
        belongsTo: "project",

        statusCode: "integer",
        url: "string",

        responseHeaders: "json",
        requestHeaders: "json",
        userAgent: "string",

        start: "float",
        end: "float",
        delta: "float",

        env: "string"
    }
});


module.exports = Request;
