var config = require("./config"),
    server = require("./server");


require("./requests");


server.listen(config.port, config.host);