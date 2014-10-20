var url = require("url"),
    api = require("./api"),
    router = require("./router");


var requests = router.scope("requests");


function get(req, res, next) {
    api.requests.get(function(err, data) {
        if (err) {
            res.send(422, err);
            return;
        }

        res.json(data);
    });
}

function create(req, res, next) {
    var data = {},
        fullUrl = url.parse(req.param("url"));

    data.host = fullUrl.host;
    data.pathname = fullUrl.pathname;

    data.requestId = req.param("requestId");
    data.userAgent = req.param("userAgent");

    data.start = req.param("start");
    data.end = req.param("end");
    data.delta = req.param("delta");

    data.statusCode = req.param("statusCode");
    data.responseHeaders = req.param("responseHeaders");
    data.requestHeaders = req.param("requestHeaders");
    data.payload = data.responseHeaders["Content-Length"] || 0;

    api.requests.create(data, function(err) {
        if (err) {
            res.send(422, err);
            return;
        }

        res.json(204);
    });
}


requests.route()
    .get(get)
    .post(create);


module.exports = requests;
