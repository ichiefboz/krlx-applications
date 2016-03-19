Router.configure({
	layoutTemplate: "layout"
});

// Homepage
Router.route("/", function() {
	this.subscribe("users").wait();
	this.subscribe("myShows").wait();
	if(this.ready()) {
		this.render("home");
		document.title = "Home - KRLX Applications";
	} else {
		this.render("loading");
	}
}, {
	name: "root"
});

// Once a show is created using a "Start Application" button,
// the user can just go to /shows/:_id/:step to work on it.
Router.route("/shows/:_id/:step", function() {
	this.subscribe("users").wait();
	this.subscribe("myShows").wait();
	if(this.ready()) {
		this.render("step"+this.params.step, {
			data: function() {
				return Shows.findOne({_id: this.params.id});
			}
		});
		document.title = "Application Step "+this.params.step+" - KRLX Applications";
	} else {
		this.render("loading");
	}
}, {
	name: "shows.application"
});

// Route for new show creation
Router.route("/shows/new", function() {
	this.subscribe("users").wait();
	this.subscribe("myShows").wait();
	if(this.ready()) {
		this.render("newShow");
		document.title = "Start New Application - KRLX Applications";
	} else {
		this.render("loading");
	}
}, {
	name: "shows.application.new"
})

// "My Shows" sidebar function
Router.route("/shows", function() {
	this.subscribe("users").wait();
	this.subscribe("myShows").wait();
	if(this.ready()) {
		this.render("myShows");
		document.title = "My Shows - KRLX Applications";
	} else {
		this.render("loading");
	}
}, {
	name: "shows.my.list"
});
