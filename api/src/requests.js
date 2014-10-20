var utils = require("utils"),
    each = require("each"),
    api = require("./index");


var requests = module.exports;


requests.get = function(callback) {
    api.mongodb.collection("requests").find(null, {
        _id: false
    }, function(err, results) {
        if (err) {
            callback(err);
            return;
        }

        results.toArray(function(err, documents) {
            if (err) {
                callback(err);
                return;
            }

            callback(undefined, documents);
        });
    });
};

requests.create = function(data, callback) {
    api.mongodb.collection("requests").insert(data, function(err) {
        if (err) {
            callback(err);
            return;
        }

        callback();
    });
};
