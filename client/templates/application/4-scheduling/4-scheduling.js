Template.step4.created = function() {
	if(this.data.conflicts) {
		Session.set("classConflicts", this.data.conflicts.classes);
		Session.set("otherConflicts", this.data.conflicts.other);
	} else {
		Session.set("classConflicts", []);
		Session.set("otherConflicts", []);
	}
}

Template.step4.helpers({
	classList: [
		{title: '"A" classes (M/W/F)', options: ["1a", "2a", "3a", "4a", "5a", "6a"]},
		{title: '"C" classes (Tu/Th)', options: ["1-2c", "2-3c", "4-5c", "5-6c"]},
		{title: 'Language ("L") classes (daily)', options: ["1a (L)", "2a (L)", "3a (L)", "4a (L)", "5a (L)"]}
	],
	classListChecked: function(value) {
		var conflicts = Session.get("classConflicts");
		return (conflicts.indexOf(value) >= 0);
	},
	otherConflicts: function() {
		return Session.get("otherConflicts");
	},
	weekdays: [
		{day: "Sunday", abbr: "sun"},
		{day: "Monday", abbr: "mon"},
		{day: "Tuesday", abbr: "tue"},
		{day: "Wednesday", abbr: "wed"},
		{day: "Thursday", abbr: "thu"},
		{day: "Friday", abbr: "fri"},
		{day: "Saturday", abbr: "sat"}
	],
	times: function(mode) {
		var times = [];
		for(var hour = 0; hour < 24; hour++) {
			var am = (hour >= 12) ? "PM" : "AM";
			var displayHour = hour;
			if(displayHour >= 12) displayHour -= 12;
			if(displayHour == 0) displayHour = 12;

			times.push({value: hour + ":00", displayTime: displayHour + ":00 " + am});
			times.push({value: hour + ":30", displayTime: displayHour + ":30 " + am});
		}
		if(mode == "end") {
			times.splice(0, 1);
			times.push({value: "24:00", displayTime: "12:00 AM"});
		}
		return times;
	},
	timeSelect: function(value, target) {
		return (value == target) ? "selected" : "";
	},
	isChecked: function(value, list) {
		return (list.indexOf(value) >= 0) ? "checked" : "";
	}
})

Template.step4.rendered = function() {
	$(".ui.checkbox").checkbox();
	$("select.dropdown").dropdown();
}
