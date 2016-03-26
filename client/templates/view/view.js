Template.viewShow.helpers({
	bandemonium: function() {
		return this.type == "Bandemonium";
	},
	org: function() {
		return this.type == "Student Org";
	},
	standard: function() {
		return this.type == "Standard";
	},
	safeHarbor: function() {
		var response = "";
		switch(this.safeHarbor) {
			case "yes": response = "Requested"; break;
			case "no": response = "Not requested"; break;
			case "meh": response = "No opinion"; break;
		}
		return response;
	},
	length: function() {
		return this.preferredLength + " minutes";
	},
	prio: function() {
		return this.priority.charAt(0);
	},
	color: function(prio) {
		var colors = {A: "black", B: "grey", C: "violet", D: "blue", E: "teal", F: "green", G: "olive", H: "yellow", I: "orange", J: "red"};
		return colors[prio];
	}
})
