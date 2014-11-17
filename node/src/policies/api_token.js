var api = require("../api");


function insureApiToken(req, res, next) {
    var apiToken = req.getHeader("X-API-Token");

    api.models.User.findOne({
        where: {
            apiToken: apiToken
        }
    }, function(err, user) {
        if (err) {
            res.json(422, err);
            return;
        }

        req.user = user;
        next();
    });
}


module.exports = insureApiToken;
