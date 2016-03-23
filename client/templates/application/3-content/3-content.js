Template.step3.helpers({
	bandemonium: function() {
		return this.type == "Bandemonium";
	},
	org: function() {
		return this.type == "Student Org";
	}
})

Template.step3.rendered = function() {
	var fieldRules = {};
	switch(this.data.type) {
		case "Student Org":
			fieldRules["sponsor"] = {rules: [
				{type: "empty", prompt: "You must specify the organization sponsoring this show"},
				{type: "minLength[3]", prompt: "Please specify the full name of your sponsoring organization, or an abbreviation if that is how you are commonly referred to on campus (e.g. CANOE, SAPB, CSA, or KRLX, but not Tonian)"}
			]};
		case "Standard":
			fieldRules["title"] = {rules: [
				{type: "empty", prompt: "Please choose a show name"},
				{type: "minLength[3]", prompt: "Please choose a show name that is at least 3 characters long"},
				{type: "doesntContain[shit]", prompt: "KRLX guidelines prohibit the word shit in show titles"},
				{type: "doesntContain[piss]", prompt: "KRLX guidelines prohibit the word piss in show titles"},
				{type: "doesntContain[fuck]", prompt: "KRLX guidelines prohibit the word fuck in show titles"},
				{type: "doesntContain[cunt]", prompt: "KRLX guidelines prohibit the word cunt in show titles"},
				{type: "doesntContain[cocksucker]", prompt: "KRLX guidelines prohibit the word cocksucker in show titles"},
				{type: "doesntContain[tits]", prompt: "KRLX guidelines prohibit the word tits in show titles"}
			]};
			fieldRules["description"] = {rules: [
				{type: "minLength[25]", prompt: "Please enter a genre or description of your show"}
			]}
			break;
		case "Bandemonium":
			fieldRules["theme"] = {rules: [
				{type: "empty", prompt: "You need to specify the artist or theme that you'll be exploring during your show"},
			]};
			fieldRules["why"] = {rules: [
				{type: "minLength[100]", prompt: "Your response to why we should pick your show must be 50 characters or longer"}
			]};
			fieldRules["description"] = {rules: [
				{type: "minLength[100]", prompt: "The description of the show, which will be posted to the web, must be at least 100 characters, however we encourage you to describe your show in as much detail as you wish"}
			]};
			break;
	}
	$(".ui.form").form({fields: fieldRules});
}

Template.step3.events({
	"submit .ui.form": function(event) {
		event.preventDefault();
		var form = event.currentTarget;
		if($(".ui.form").form("is valid")) {
			var data = {};
			if(this.type == "Student Org") data.sponsor = form.sponsor.value;
			if(this.type != "Bandemonium") data.title = form.title.value;
			if(this.type == "Bandemonium") {
				data.theme = form.theme.value;
				data.why = form.why.value;
			}
			data.description = form.description.value;
			Meteor.call("updateShow", this._id, data);
			if(this.step <= 3) {
				Meteor.call("incrementStep", this._id, 4, function(error, result) {
					if(result) {
						Router.go("shows.application", {_id: result, step: 4});
					}
				});
			} else {
				Router.go("shows.application", {_id: this._id, step: 4});
			}
		}
	},
	"click #goBackButton": function() {
		Router.go("shows.application", {_id: this._id, step: 2});
	}
})
