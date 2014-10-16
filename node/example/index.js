var $ = require("jquery");

require("../src/index");


$.ajax("package.json", {
    type: "GET"
});
