var api = require("../api"),
    router = require("../router");


var users = router.scope("users");


function show(req, res) {
    api.models.User.findOne({
        where: {
            id: req.param("id")
        }
    }, function(err, user) {
        if (err) {
            res.json(422, err);
            return;
        }

        res.json(user);
    });
}

function findByToken(req, res) {
    api.models.User.findOne({
        where: {
            apiToken: req.param("apiToken")
        }
    }, function(err, user) {
        if (err) {
            res.json(422, err);
            return;
        }

        res.json(user);
    });
}

function signIn(req, res) {
    var email = req.param("email"),
        password = req.param("password");

    api.models.User.findOne({
        email: email
    }, function(err, user) {
        if (err) {
            res.json(422, err);
            return;
        }

        user.comparePassword(password, function(err, isMatch) {
            if (err) {
                res.json(422, err);
                return;
            }

            if (isMatch) {
                res.json(user);
            } else {
                res.json(422, "user.invalid_credentials");
            }
        });
    });
}

function signUp(req, res) {
    var data = {};

    data.email = req.param("email");
    data.password = req.param("password");

    api.models.User.create(data, function(err, user) {
        if (err) {
            res.json(422, err);
            return;
        }

        res.json(user);
    });
}

function signOut(req, res) {

    res.json(204);
}

function confirm(req, res) {
    api.models.User.confirm(req.param("confirmToken"), function(err, user) {
        if (err) {
            res.json(422, err);
            return;
        }

        res.json(user);
    });
}

function createConfirmToken(req, res) {
    api.models.User.createConfirmToken(req.param("id"), function(err, user) {
        if (err) {
            res.json(422, err);
            return;
        }

        res.json(user);
    });
}

users.route("/sign_in")
    .post(signIn);

users.route("/sign_up")
    .post(signUp);

users.route("/sign_out")
    .delete(signOut);

users.route("/:id[0-9]")
    .get(show);

users.route("/token/:apiToken")
    .get(findByToken);

users.route("/:id[0-9]/confirm")
    .get(createConfirmToken);

users.route("/confirm")
    .patch(confirm);


module.exports = users;
