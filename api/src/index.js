var MongoClient = require("mongodb").MongoClient,
    config = require("./config");


var api = module.exports;


api.requests = require("./requests");


api.init = function(callback) {
    MongoClient.connect("mongodb://127.0.0.1:" + config.mongodb.port + "/" + config.mongodb.database, function(err, mongodb) {
        if (err) {
            callback(err);
            return;
        }

        api.mongodb = mongodb;

        callback();
    });
};

api.close = function() {

    api.mongodb.close();
};
