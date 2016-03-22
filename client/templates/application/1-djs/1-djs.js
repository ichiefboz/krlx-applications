Template.step1.helpers({
	djList: function() {
		return Session.get("djs");
	},
	readonly: function(value) {
		return (value == this.owner || value == Meteor.user().krlx.netid) ? "readonly" : "";
	},
	displayIndex: function(index) {
		return index + 1;
	},
	inReview: function() {
		return this.step == 5;
	},
	justCreated: function() {
		return this.step == 1;
	},
	errorPossibilities: [
		{code: "not-signed-in", header: "Not Signed In", message: "You need to be signed in to save your application! Click \"Sign In\" below to sign in with your Carleton account, then try again.", flags: ["nevermind", "signin"]},
		{code: "show-does-not-exist", header: "Show disappeared", message: "Looks like that show doesn't exist, likely beacuse its owner deleted it. You should head on back to My Shows.", flags: ["myshows"]},
		{code: "new-djs-must-be-array", header: "Unknown Submission", message: "Ruh roh, the form got goofed up and can't be submitted properly. Please reload the page and try again."},
		{code: "invalid-djs", header: "No Valid DJs", message: "You didn't enter any valid DJ usernames. Be sure to check your spelling on everyone's username, and make sure AutoCorrect didn't accidentally insert any odd spaces. If your username keeps throwing this error please email an IT engineer."}
	]
})

Template.step1.created = function() {
	Session.set("djs", this.data.djs);
}

Template.step1.events({
	"click #myShowsButton": function() {
		Router.go("shows.my.list");
	},
	"click .submit.ui.button": function(event) {
		event.preventDefault();
		var djs = Session.get("djs");
		djs.sort();
		Meteor.call("updateShowStep1", this._id, djs, function(error, result) {
			if(error) {
				$("#error-"+error.error).modal("show");
			}
			if(result) {
				var step = (event.currentTarget.id == "backToReview") ? 5 : 2;
				Router.go("shows.application", {_id: result, step: step});
			}
		});
	},
	"click #addDJ": function() {
		var djs = Session.get("djs");
		if(djs[djs.length - 1].trim().length > 0) {
			djs.push("");
			Session.set("djs", djs);
		}
	},
	"click #removeDJ": function() {
		var djs = Session.get("djs");
		console.log(djs);
		for(var i = djs.length - 1; i >= 0; i--) {
			// Break if there's only one item
			if(i == 0) break;
			// Continue to next item if the owner is selected
			if(djs[i] == this.owner) continue;
			// Continue to next item if current user is selected
			if(djs[i] == Meteor.user().krlx.netid) continue;
			// Remove item i
			djs.splice(i, 1);
			break;
		}
		Session.set("djs", djs);
	},
	"change .dj-input": function() {
		var djs = Session.get("djs");
		var newDJs = [];
		for(var i = 0; i < djs.length; i++) {
			var newValue = $("input[name='dj-"+i+"']").val().trim();
			if(newValue.indexOf("@") >= 0) {
				newValueBits = newValue.split("@");
				newValue = newValueBits[0];
			}
			if(newDJs.indexOf(newValue) == -1 && newValue.length > 0) {
				newDJs.push(newValue);
			}
		}
		Session.set("djs", newDJs);
	}
})
