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

Template.home.rendered = function() {
	Meteor.call("numberOfCompletedShows", function(error, result) {
		if(result != null) {
			$("#showCount").text(result);
		}
	});
	Meteor.call("numberOfActiveDjs", function(error, result) {
		if(result != null) {
			$("#djCount").text(result);
		}
	});
	Meteor.call("numberOfNewActiveDjs", function(error, result) {
		if(result != null) {
			$("#newDjCount").text(result);

			var total = parseInt($("#djCount").text());
			var numberNew = parseInt(result);
			if(total == 0) total = 1;
			$("#percentage").text(Math.floor((numberNew / total) * 100));
		}
	});
}
