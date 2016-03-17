Router.configure({
	layoutTemplate: "layout"
});

// Homepage
Router.route("/", function() {
	this.render("myShows");
}, {
	name: "shows.my.list"
});
