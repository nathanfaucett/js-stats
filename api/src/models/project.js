var orm = require("orm");


var Project = new orm.define({
    name: "Project",

    schema: {
        belongsTo: "user",
        hasMany: "requests"
    }
});


module.exports = Project;
