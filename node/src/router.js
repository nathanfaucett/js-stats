var layers = require("layers"),
    
    Cors = require("cors"),
	BodyParser = require("body_parser");


var router = new layers.Router();


router.use(
	new Cors(),
	new BodyParser()
);


module.exports = router;