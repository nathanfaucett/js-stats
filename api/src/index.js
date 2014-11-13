var collection = require("./collection"),
    config = require("./config");


var api = module.exports;


api.models = require("./models/index");


api.init = function(callback) {
    collection.init(function(err) {
        if (err) {
            console.log(err);
            return;
        }

        callback();
    });
};

api.close = function() {
    if (collection) {
        //collection.close();
    }
};
