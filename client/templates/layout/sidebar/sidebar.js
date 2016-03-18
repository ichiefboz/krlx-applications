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
	}
})
