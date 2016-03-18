Template.sidebar.helpers({
	userNetID: function() {
		if(Meteor.user()) {
			if(Meteor.user().services) {
				var email = Meteor.user().services.google.email;
				if(email) {
					return email.split("@")[0];
				}
			}
		}
		return "";
	},
	userName: function() {
		if(Meteor.user()) {
			if(Meteor.user().services) {
				return Meteor.user().services.google.name;
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
