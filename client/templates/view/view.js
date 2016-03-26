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
	},
	displayName: function(netid) {
		var dj = DJs.findOne({netid: netid});
		return (dj.name == null) ? netid : dj.name;
	},
	classes: function() {
		return this.conflicts.classes.join(", ");
	},
	conflicts: function() {
		return this.badSundays.join(", ");
	},
	displayDays: function(days) {
		var weekdays = {
			sun: {display: "Sunday", color: "grey"},
			mon: {display: "Monday", color: "olive"},
			tue: {display: "Tuesday", color: "red"},
			wed: {display: "Wednesday", color: "blue"},
			thu: {display: "Thursday", color: "green"},
			fri: {display: "Friday", color: "yellow"},
			sat: {display: "Saturday", color: "brown"}
		};
		var returnDays = [];
		for(var i = 0; i < days.length; i++) {
			returnDays.push(weekdays[days[i]]);
		}
		return returnDays;
	},
	displayTime: function(time) {
		// time comes in as 24 hours
		var timeSplit = time.split(":");
		var hours = timeSplit[0];
		var am = (hours >= 12 && hours <= 23) ? "PM" : "AM";
		var displayHours = (hours >= 12) ? hours - 12 : hours;
		if(displayHours == 0) displayHours = 12;

		return displayHours + ":" + timeSplit[1] + " " + am;
	}
})
