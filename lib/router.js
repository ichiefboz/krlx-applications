Router.configure({
	layoutTemplate: "layout"
});

// Homepage
Router.route("/", function() {
	this.render("myShows");
}, {
	name: "root"
});

// "My Shows" sidebar function
Router.route("/shows", function() {
	this.render("myShows");
}, {
	name: "shows.my.list"
});
