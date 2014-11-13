var api = require("./api"),
    config = require("./config"),
    router = require("./router"),
    server = require("./server");


require("./routes/index");


api.init(function(err) {
    if (err) {
        console.log(err);
        return;
    }

    server.listen(config.port, config.host);
});


process.on("exit", function() {

    api.close();
});
