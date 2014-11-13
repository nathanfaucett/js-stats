var orm = require("orm"),
    MongoAdapter = require("mongodb_adapter");


var collection = orm({
    schema: {
        timestamps: {
            underscore: false
        }
    },
    defaultAdapter: "mongo",
    adapters: {
        "mongo": new MongoAdapter({
            database: "stats"
        })
    }
});

collection.bindModels(
    require("./models/user")
);


module.exports = collection;
