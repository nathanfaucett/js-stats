var api = require("../api");


function insureProject(req, res, next) {
    var projectId = req.param("projectId");

    api.models.Project.findOne({
        where: {
            id: projectId,
            userId: req.user.id
        }
    }, function(err, project) {
        if (err) {
            res.json(422, err);
            return;
        }

        req.project = project;
        next();
    });
}


module.exports = insureProject;
