Template.step1.helpers({
	djList: function() {
		return Session.get("djs");
	},
	readonly: function(value) {
		return (value == this.owner || value == Meteor.user().krlx.netid) ? "readonly" : "";
	},
	displayIndex: function(index) {
		return index + 1;
	}
})

Template.step1.created = function() {
	Session.set("djs", this.data.djs);
}

Template.step1.events({
	"click #myShowsButton": function() {
		Router.go("shows.my.list");
	},
	"submit .ui.form": function(event) {
		event.preventDefault();
		var djs = Session.get("djs");
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
