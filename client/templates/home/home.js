Template.home.events({
	"click .new-app-button": function() {
		Router.go("shows.application.new");
	},
	"click .sign-in-button": function() {
		Meteor.loginWithGoogle({
			loginUrlParameters: {
				hd: "carleton.edu"
			}
		});
	}
})
