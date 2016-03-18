Template.sidebar.helpers({
	userNetID: function() {
		if(Meteor.user()) {
			if(Meteor.user().krlx) {
				return Meteor.user().krlx.netid;
			}
		}
		return "";
	},
	userName: function() {
		if(Meteor.user()) {
			if(Meteor.user().krlx) {
				return Meteor.user().krlx.name;
			}
		}
		return "";
	},
	activeItem: function(destination) {
		return (Router.current().route.getName() == destination) ? "active" : "";
	}
})

Template.sidebar.events({
	"click a#myShowsLink": function() {
		Router.go("shows.my.list");
	},
	"click a#signOutLink": function() {
		Meteor.logout();
	},
	"click a#signInLink": function() {
		Meteor.loginWithGoogle({
			loginUrlParameters: {
				hd: "carleton.edu"
			}
		});
	},
	"click a#startLink": function() {
		if(Router.current().route.getName() != "shows.application") {
			Meteor.call("createShow", "Standard", function(error, result) {
				if(result) {
					Router.go("shows.application", {_id: result, step: 1})
				}
			});
		}
	}
})
