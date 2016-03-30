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

Template.home.helpers({
	djCount: function() {
		return DJs.find({}).count();
	}
})

Template.home.rendered = function() {
	Meteor.call("numberOfCompletedShows", function(error, result) {
		if(result) {
			$("#showCount").text(result);
		}
	});
}
