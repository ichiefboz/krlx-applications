Template.step4.created = function() {
	if(this.data.conflicts) {
		Session.set("classConflicts", this.data.conflicts.classes);
		Session.set("otherConflicts", this.data.conflicts.other);
		Session.set("preferences", this.data.preferences);
	} else {
		Session.set("classConflicts", []);
		Session.set("otherConflicts", []);
		Session.set("preferences", []);
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
	setIndex: function(conflict, index) {
		conflict.conflictIndex = index;
	},
	labDays: [
		{day: "Monday", abbr: "mon"},
		{day: "Tuesday", abbr: "tue"},
		{day: "Wednesday", abbr: "wed"},
		{day: "Thursday", abbr: "thu"},
		{day: "Friday", abbr: "fri"}
	],
	artConflicts: [
		{displayAs: "Monday/Wednesday", options: [
			{days: "mon wed", start: "8:30", end: "11:00", title: "M/W morning art (8:30 - 11 AM)"},
			{days: "mon wed", start: "12:30", end: "15:00", title: "M/W afternoon art (12:30 - 3 PM)"}
		]},
		{displayAs: "Tuesday/Thursday", options: [
			{days: "tue thu", start: "9:15", end: "11:45", title: "Tu/Th morning art (9:15 - 11:45 AM)"},
			{days: "tue thu", start: "13:15", end: "15:45", title: "Tu/Th afternoon art (1:15 - 3:45 PM)"}
		]}
	],
	lengthOptions: [
		{item: 30, display: "30 minutes (½ hour)"},
		{item: 60, display: "60 minutes (1 hour)"},
		{item: 90, display: "90 minutes (1½ hours)"},
		{item: 120, display: "120 minutes (2 hours)"}
	],
	safeHarborOptions: [
		{item: "yes", display: "Yes please"},
		{item: "no", display: "No thanks"},
		{item: "meh", display: "Meh, doesn't matter to me"}
	],
	preferredLengthChecked: function(value) {
		if(this.preferredLength) {
			return this.preferredLength == value;
		} else {
			return value == 60;
		}
	},
	safeHarborChecked: function(value) {
		if(this.safeHabor) {
			return this.safeHabor == value;
		} else {
			return value == "meh";
		}
	}
})

Template.recurringBlock.helpers({
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
	$('.ui.radio.checkbox').checkbox();
	$(".ui.checkbox").checkbox();
	$("select.dropdown").dropdown();
}

Template.step4.events({
	"click #addCommon": function() {
		$("#commonConflictModal").modal("show");
	}
})
