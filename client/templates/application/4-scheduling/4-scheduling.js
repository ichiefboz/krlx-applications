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
	preferences: function() {
		return Session.get("preferences");
	},
	setIndex: function(conflict, index) {
		conflict.conflictIndex = index;
	},
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

Template.recurringBlock.rendered = function() {
	$(".ui.checkbox").checkbox();
	$("select.dropdown").dropdown();
}

Template.step4.rendered = function() {
	$("#explainSafeHarbor").popup();
}

Template.step4.events({
	"click .addRecurringBlob": function(event) {
		var sessionBlob = event.currentTarget.dataset.mode;
		var blobs = Session.get(sessionBlob);
		if(blobs.length == 0) {
			blobs.push({days: [], start: "12:00", end: "13:00"});
		} else {
			var lastBlob = blobs[blobs.length - 1];
			if(!(lastBlob.days.length == 0 || lastBlob.start == null || lastBlob.end == null)) {
				blobs.push({days: [], start: "12:00", end: "13:00"});
			}
		}
		Session.set(sessionBlob, blobs);
	},
	"click .removeRecurringBlob": function(event) {
		var sessionBlob = event.currentTarget.dataset.mode;
		var blobs = Session.get(sessionBlob);
		if(blobs.length > 0) {
			var lastBlob = blobs[blobs.length - 1];
			if(!(lastBlob.days.length == 0 || lastBlob.start == null || lastBlob.end == null)) {
				blobs.splice(blobs.length - 1, 1);
			}
		}
		Session.set(sessionBlob, blobs);
	}
})

Template.recurringBlock.events({
	"change input, select": function(event) {
		var index = event.currentTarget.dataset.index;
		var days = [];
		$('input[name="conflictDays-'+index+'"]:checked').each(function() {
			days.push($(this).val());
		});
		var start = $('select[name="conflictStart-'+index+'"]').val();
		var end = $('select[name="conflictEnd-'+index+'"]').val();
		var conflicts = Session.get("otherConflicts");
		conflicts[index] = {days: days, start: start, end: end};
		Session.set("otherConflicts", conflicts);
	}
})
