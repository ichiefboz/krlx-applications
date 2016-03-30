Router.configure({
	layoutTemplate: "layout",
	onAfterAction: function() {
		if(Meteor.isClient) {
			$(window).scrollTop(0);
		}
	}
});

// Homepage
Router.route("/", function() {
	this.subscribe("users").wait();
	this.subscribe("myShows").wait();
	this.subscribe("djBasicDetails").wait();
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
		var thisShow = Shows.findOne({_id: this.params._id});
		if(thisShow.completed) this.redirect("/shows");

		this.render("step"+this.params.step, {
			data: function() {
				return Shows.findOne({_id: this.params._id});
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
	this.subscribe("djBasicDetails").wait();
	if(this.ready()) {
		this.render("myShows");
		document.title = "My Shows - KRLX Applications";
	} else {
		this.render("loading");
	}
}, {
	name: "shows.my.list"
});

// "All Shows" sidebar function (for board members)
Router.route("/shows/all", function() {
	this.subscribe("users").wait();
	this.subscribe("completedShows").wait();
	this.subscribe("djBasicDetails").wait();
	if(this.ready()) {
		this.render("allShows", {
			data: function() {
				return Shows.find({}, {sort: {board: -1, type: -1, priority: 1, completed: 1}});
			}
		});
		document.title = "All Shows - KRLX Applications";
	} else {
		this.render("loading");
	}
}, {
	name: "shows.all.list"
});

Router.route("/shows/:_id", function() {
	this.subscribe("users").wait();
	this.subscribe("myShows").wait();
	this.subscribe("completedShows").wait();
	this.subscribe("djsInShow", this.params._id).wait();
	if(this.ready()) {
		this.render("viewShow", {
			data: function() {
				return Shows.findOne({_id: this.params._id});
			}
		});
		document.title = "View Show - KRLX Applications";
	} else {
		this.render("loading");
	}
}, {
	name: "shows.view"
});

Router.route("/shows/download/:shows", {
	action: function() {
		var shows = this.params.shows.split("|");
		var dataToDownload = [];
		var fullDays = {sun: "Sunday", mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday"};
		var showFields = ["badSundays", "sponsor", "conflicts", "preferences", "why", "theme", "title", "safeHarbor", "preferredLength"];
		var filename = (shows.length > 1) ? "shows" : "show-" + shows[0];
		var headers = {
			'Content-type': 'text/csv',
			'Content-Disposition': "attachment; filename=" + filename + ".csv"
		};
		for(var h = 0; h < shows.length; h++) {
			var show = Shows.findOne({_id: shows[h]});;
			show.djs = show.djs.join(", ");
			if(show.type == "Bandemonium") {
				show.badSundays = show.badSundays.join(", ");
			} else {
				show.classes = show.conflicts.classes.join(", ");
				var otherConflictData = [];
				var otherPrefData = [];
				for(var i = 0; i < show.conflicts.other.length; i++) {
					var thisConflict = show.conflicts.other[i];
					for(var j = 0; j < thisConflict.days.length; j++) {
						thisConflict.days[j] = fullDays[thisConflict.days[j]];
					}
					otherConflictData.push(thisConflict.days.join(", ") + " " + thisConflict.start + " - " + thisConflict.end);
				}
				for(var i = 0; i < show.preferences.length; i++) {
					var thisPref = show.preferences[i];
					for(var j = 0; j < thisPref.days.length; j++) {
						thisPref.days[j] = fullDays[thisPref.days[j]];
					}
					otherPrefData.push(thisPref.days.join(", ") + " " + thisPref.start + " - " + thisPref.end);
				}
				show.conflicts = otherConflictData.join("; ");
				show.preferences = otherPrefData.join("; ");
			}
			for(var k = 0; k < showFields.length; k++) {
				if(!show[showFields[k]]) show[showFields[k]] = "";
			}
			dataToDownload.push(show);
		}

		var csv = Papa.unparse(dataToDownload);
		this.response.writeHead(200, headers);
		this.response.end(csv);
	},
	where: "server",
	name: "shows.download"
});

Router.route("/djs", function() {
	this.subscribe("users").wait();
	this.subscribe("completedShows").wait();
	this.subscribe("djAdvDetails").wait();
	if(this.ready()) {
		this.render("djList");
		document.title = "DJs - KRLX Applications";
	} else {
		this.render("loading");
	}
}, {
	name: "djs.active.list"
})
