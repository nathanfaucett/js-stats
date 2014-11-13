var api = require("../api"),
    router = require("../router");


var apiScope = router.scope(":apiToken/:projectId");


apiScope.use(
    function(req, res, next) {
        api.models.User.findOne({
            where: {
                apiToken: req.param("apiToken")
            }
        }, function(err, user) {
            if (err) {
                res.json(422, err);
                return;
            }

            api.models.Project.findOne({
                where: {
                    id: req.param("projectId")
                }
            }, function(err, project) {
                if (err) {
                    res.json(422);
                    return;
                }

                req.user = user;
                req.project = project;

                next();
            });
        });
    }
);


module.exports = apiScope;
