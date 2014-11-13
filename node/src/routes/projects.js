var url = require("url"),
    api = require("../api"),
    router = require("./api_scope");


var projects = router.scope("projects");


function get(req, res) {
    api.models.requests.get(function(err, data) {
        if (err) {
            res.send(422, err);
            return;
        }

        res.json(data);
    });
}


requests.route()
    .get(get)
    .post(create);


module.exports = requests;
