var orm = require("orm");


var Project = new orm.define({
    name: "Project",

    schema: {
        title: "string",
        description: "string",
        belongsTo: "user",
        hasMany: ["requests"]
    }
});

Project.accessible(
    "title",
    "description"
);

Project.validates("title")
    .required();


module.exports = Project;
