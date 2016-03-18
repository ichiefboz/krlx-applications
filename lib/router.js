Router.configure({
	layoutTemplate: "layout"
});

// Homepage
Router.route("/", function() {
	this.subscribe("allUsernames").wait();
	if(this.ready()) {
		this.render("myShows");
	} else {
		this.render("loading");
	}
}, {
	name: "root"
});

// "My Shows" sidebar function
Router.route("/shows", function() {
	this.subscribe("allUsernames").wait();
	if(this.ready()) {
		this.render("myShows");
	} else {
		this.render("loading");
	}
}, {
	name: "shows.my.list"
});
