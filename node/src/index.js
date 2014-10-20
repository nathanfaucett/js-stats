var api = require("./api"),
    config = require("./config"),
    server = require("./server");


require("./requests");


api.init(function(err) {
    if (err) {
        console.log(err);
        return;
    }

    server.listen(config.port, config.host);
});


process.on("exit", function() {

    api.close();
})
