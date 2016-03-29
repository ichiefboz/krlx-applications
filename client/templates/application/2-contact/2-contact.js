Template.step2.helpers({
	getDJData: function(target) {
		return DJs.findOne({netid: target});
	}
})

Template.step2.rendered = function() {
	Meteor.subscribe("djsInShow", this.data._id);
	var djList = this.data.djs;
	var fieldRules = {};
	var currentYear = (new Date).getFullYear();
	for(var i = 0; i < djList.length; i++) {
		var username = djList[i];
		fieldRules["name-" + username] = {rules: [{
			type: "empty",
			prompt: "Please enter " + username + "'s full name."
		}, {
			type: "contains[ ]",
			prompt: "Make sure you've entered " + username + "'s full name, including their last."
		}]};
		fieldRules["year-" + username] = {rules: [{
			type: "integer["+currentYear+".."+(currentYear+4)+"]",
			prompt: "Please choose a valid class year for " +username+ "."
		}]};
		fieldRules["phone-" + username] = {rules: [{
			type: "empty",
			prompt: "Your cell phone number is required, even if you have requested a directory suppress. Please enter " + username + "'s phone number."
		}, {
			type: "regExp[/^(\()?([2-9][0-9]{2})(\))?[-. ]?([2-9](?!11)[0-9]{2})[-. ]?([0-9]{4})$/]",
			prompt: username + "'s phone number is invalid. Please enter a valid phone number. Note that international numbers may not be used."
		}]};
		fieldRules["campusPhone-" + username] = {rules: [{
			type: "regExp[/^$|^[2-8][0-9]{3}$/]",
			prompt: username + "'s campus phone number is invalid. Please enter the last four digits only."
		}]};
		fieldRules["terms-" + username] = {rules: [{
			type: "integer[0..13]",
			prompt: "Please choose the terms of experience for " + username + ". Remember to choose 0 if " + username + " is completely new to KRLX."
		}]};
	}
	$(".ui.form").form({fields: fieldRules});
}

Template.step2.events({
	"submit .ui.form": function(event) {
		event.preventDefault();
		var form = event.currentTarget;
		if($(".ui.form").form("is valid")) {
			for(var i = 0; i < this.djs.length; i++) {
				var data = {
					name: form["name-" + this.djs[i]].value,
					year: parseInt(form["year-" + this.djs[i]].value),
					terms: parseInt(form["terms-" + this.djs[i]].value),
					phone: form["phone-" + this.djs[i]].value,
				};
				if(form["campusPhone-" + this.djs[i]].value) {
					data["campusPhone"] = form["campusPhone-" + this.djs[i]].value
				}
				Meteor.call("updateDJ", this.djs[i], data);
			}
			if(this.step <= 2) {
				Meteor.call("incrementStep", this._id, 3, function(error, result) {
					if(result) {
						Router.go("shows.application", {_id: result, step: 3});
					}
				});
			} else {
				Router.go("shows.application", {_id: this._id, step: 3})
			}
		}
	},
	"click #goBackButton": function() {
		Router.go("shows.application", {_id: this._id, step: 1});
	}
})

Template.contactForm.helpers({
	displayName: function() {
		return (this.name == null) ? this.netid : this.name;
	},
	currentYear: function() {
		return (new Date).getFullYear();
	},
	displayYear: function() {
		return (this.year == null) ? (new Date).getFullYear()+10 : this.year;
	}
})
