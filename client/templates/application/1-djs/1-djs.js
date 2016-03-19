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
	"change .dj-input": function(event) {
		var index = parseInt(event.currentTarget.dataset.index);
		var newValue = event.currentTarget.value;
		var djs = Session.get("djs");
		djs[index] = newValue;
		Session.set("djs", djs);
	}
})
