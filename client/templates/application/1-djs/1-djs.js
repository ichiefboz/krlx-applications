Template.step1.helpers({
	djList: function() {
		return Session.get("djs");
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
	"change .dj-input": function(event) {
		var index = parseInt(event.currentTarget.dataset.index);
		var newValue = event.currentTarget.value;
		var djs = Session.get("djs");
		djs[index] = newValue;
		Session.set("djs", djs);
	}
})
