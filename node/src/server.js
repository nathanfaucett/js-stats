var http = require("http"),
	context = require("context"),

	config = require("./config"),
	router = require("./router");


var server = new http.Server(function handler(req, res) {
	context.init(req, res, config.context);
	router.handler(req, res);
});


module.exports = server;