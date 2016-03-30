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
	},
	userBoard: function() {
		if(Meteor.user()) {
			if(Meteor.user().krlx) {
				return Meteor.user().krlx.board;
			}
		}
		return "";
	}
})

Template.sidebar.events({
	"click a#homeLink": function() {
		Router.go("root");
	},
	"click a#myShowsLink": function() {
		Router.go("shows.my.list");
	},
	"click a#allShowsLink": function() {
		Router.go("shows.all.list");
	},
	"click a#allDjsLink": function() {
		Router.go("djs.active.list");
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
		Router.go("shows.application.new");
	}
})
