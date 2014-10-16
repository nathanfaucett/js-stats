var api = require("./api"),
	router = require("./router");


var requests = router.scope("requests");
	

function create(req, res, next) {
	
	api.requests.create(req.body, function(err, data) {
		if (err) {
			res.json(422, err);
			return;
		}
		
		res.send(204);
	});
}


requests.route()
	.post(create)