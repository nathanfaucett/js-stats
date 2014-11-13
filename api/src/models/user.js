var orm = require("orm"),
    bcrypt = require("bcrypt");


function uid(length) {
    var str = "";
    length || (length = 32);
    while (length--) str += uid.chars[(Math.random() * 62) | 0];
    return str;
}
uid.chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";


var User = new orm.define({
    name: "User",

    schema: {
        confirmed: "boolean",
        confirmToken: "string",
        apiToken: "string",
        email: {
            type: "string",
            unique: true
        },
        password: "string"
    }
});

User.accessible(
    "email"
);

User.validates("email")
    .required()
    .email();

User.validates("password")
    .required()
    .minLength(6);

User.on("init", function(next) {

    function encryptPassword(model, next) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                next(err);
                return;
            }

            bcrypt.hash(model.password, salt, function(err, hash) {
                if (err) {
                    next(err);
                    return;
                }

                model.password = hash;
                next();
            });
        });
    }

    this.on("beforeCreate", encryptPassword);
    this.on("beforeSave", encryptPassword);

    function createApiToken(model, next) {

        if (model.apiToken == null) model.apiToken = uid(64);
        next();
    }

    this.on("beforeCreate", createApiToken);
    this.on("beforeSave", createApiToken);

    next();
});

User.prototype.toJSON = function() {
    var json = {};

    json.id = this.id;
    json.email = this.email;
    json.apiToken = this.apiToken;
    json.createdAt = this.createdAt;
    json.updatedAt = this.updatedAt;

    return json;
};

User.prototype.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) {
            callback(err);
            return;
        }
        callback(undefined, isMatch);
    });
    return this;
};

User.confirm = function(confirmToken, callback) {
    this.findOne({
        where: {
            confirmToken: confirmToken
        }
    }, function(err, user) {
        if (err) {
            callback(err);
            return;
        }

        if (user.confirmed === true) {
            callback("user.confirmed.already");
        } else {
            user.confirmed = true;
            user.update(function(err, user) {
                if (err) {
                    callback(err);
                    return;
                }
                callback(undefined, user);
            });
        }
    });
    return this;
};

User.createConfirmToken = function(id, callback) {
    this.findOne({
        where: {
            id: id
        }
    }, function(err, user) {
        if (err) {
            callback(err);
            return;
        }

        if (user.confirmed === true) {
            callback("user.confirmed.already");
        } else {
            user.confirmToken = uid(32);
            user.update(function(err, user) {
                if (err) {
                    callback(err);
                    return;
                }
                callback(undefined, user);
            });
        }
    });
    return this;
};


module.exports = User;
