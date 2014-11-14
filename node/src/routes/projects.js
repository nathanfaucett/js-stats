var url = require("url"),
    api = require("../api"),
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

projects.use(
    function(req, res, next) {
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
);


projects.route()
    .get(index)
    .post(create);

projects.route("/:id")
    .get(show);


module.exports = projects;
