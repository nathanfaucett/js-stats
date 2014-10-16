var utils = require("utils");


var requests = module.exports,
	requestData = {};


requests.create = function(data, callback) {
	
	process.nextTick(function() {
		var copy = utils.deepCopy(data);
		
		requestData[data.requestId] = copy;
		callback(null, copy);
		
		console.log(requestData);
	});
}