var api = require("../api"),
    router = require("../router");


var projects = router.scope("projects");


function index(req, res, next) {
    api.models.Project.find({
        where: {
            userId: req.user.id
        }
    },  function(err, projects) {
        if (err) {
            res.json(422, err);
            return;
        }

        res.json(projects);
    });
}

function show(req, res, next) {
    api.models.Project.findOne({
        where: {
            id: req.param("id"),
            userId: req.user.id
        }
    },  function(err, project) {
        if (err) {
            res.json(422, err);
            return;
        }

        res.json(project);
    });
}

function create(req, res, next) {
    var data = {};

    data.title = req.param("title");
    data.description = req.param("description");
    data.userId = req.user.id;

    api.models.Project.create(data,  function(err, project) {
        if (err) {
            res.json(422, err);
            return;
        }

        res.json(project);
    });
}

function destroy(req, res, next) {
    api.models.Project.destroy({
        where: {
            id: req.param("id"),
            userId: req.user.id
        }
    },  function(err, project) {
        if (err) {
            res.json(422, err);
            return;
        }

        res.json(project);
    });
}

projects.use(
    require("../policies/api_token")
);


projects.route()
    .get(index)
    .post(create);

projects.route("/:id[0-9]")
    .get(show)
    .delete(destroy);


projects.use("/:projectId[0-9]",
    require("../policies/project")
);

module.exports = projects;
