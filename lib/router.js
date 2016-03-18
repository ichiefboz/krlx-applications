Router.configure({
	layoutTemplate: "layout"
});

// Homepage
Router.route("/", function() {
	this.subscribe("users").wait();
	if(this.ready()) {
		this.render("myShows");
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
		var thisShow = Shows.findOne({_id: this.params._id});
		if(!thisShow) {
			Router.go("shows.my.list");
		} else {
			if(this.params.step <= thisShow.step) {
				var templateToRender = "application" + this.params.step;
				this.render(templateToRender);
			} else {
				Router.go("shows.my.list");
			}
		}
	} else {
		this.render("loading");
	}
}, {
	name: "shows.application"
});

// "My Shows" sidebar function
Router.route("/shows", function() {
	this.subscribe("users").wait();
	if(this.ready()) {
		this.render("myShows");
	} else {
		this.render("loading");
	}
}, {
	name: "shows.my.list"
});
