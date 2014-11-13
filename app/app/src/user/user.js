var request = require("request"),
    cookies = require("cookies");


var user = module.exports;


user.id = null;
user.apiToken = null;


user.create = function(data) {

    user.id = data.id;
    user.apiToken = data.apiToken;

    cookies.set("apiToken", data.apiToken);
    request.defaults.headers["X-Stats-Token"] = data.apiToken;
};

user.destroy = function() {

    user.id = null;
    user.apiToken = null;

    cookies.remove("apiToken");
    delete request.defaults.headers["X-Stats-Token"];
};
