var api = require("../api"),
    router = require("./projects");


var requests = router.scope("/:projectId[0-9]/requests");


function index(req, res) {
    api.models.Request.find({
        where: {
            projectId: req.project.id
        }
    }, function(err, requests) {
        if (err) {
            res.json(422, err);
            return;
        }

        res.json(requests);
    });
}

function create(req, res) {
    var data = {};

    data.projectId = req.project.id;

    data.statusCode = req.param("statusCode");
    data.url = req.param("url");

    data.responseHeaders = req.param("responseHeaders");
    data.requestHeaders = req.param("requestHeaders");
    data.userAgent = req.param("userAgent");

    data.start = req.param("start");
    data.end = req.param("end");
    data.delta =req.param("delta");

    data.env = req.param("env");

    api.models.Request.create(data, function(err, requests) {
        if (err) {
            res.json(422, err);
            return;
        }

        res.json(requests);
    });
}


requests.route()
    .get(index)
    .post(create);


module.exports = requests;
