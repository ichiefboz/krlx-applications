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
	sundays: [
		{item: 2, display: "2nd Sunday (April 10)"},
		{item: 3, display: "3rd Sunday (April 17)"},
		{item: 4, display: "4th Sunday (April 24)"},
		{item: 5, display: "5th Sunday (May 1) - Midterm Break"},
		{item: 6, display: "6th Sunday (May 8)"},
		{item: 7, display: "7th Sunday (May 15)"},
		{item: 8, display: "8th Sunday (May 22)"},
		{item: 9, display: "9th Sunday (May 29) - Memorial Day weekend"},
	],
	sundayChecked: function(value) {
		return (this.badSundays) ? (conflicts.indexOf(value) >= 0) : false;
	},
	classList: [
		{title: '"A" classes (M/W/F)', options: ["1a", "2a", "3a", "4a", "5a", "6a"]},
		{title: '"C" classes (Tu/Th)', options: ["1-2c", "2-3c", "4-5c", "5-6c"]},
		{title: 'Language ("L") classes (daily)', options: ["1a (L)", "2a (L)", "3a (L)", "4a (L)", "5a (L)"]}
	],
	classListChecked: function(value) {
		var conflicts = Session.get("classConflicts");
		return (conflicts.indexOf(value) >= 0);
	},
	bandemonium: function() {
		return this.type == "Bandemonium";
	},
	otherConflicts: function() {
		return Session.get("otherConflicts");
	},
	preferences: function() {
		return Session.get("preferences");
	},
	setIndex: function(conflict, mode, index) {
		conflict.conflictIndex = index;
		conflict.mode = mode;
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
	$("select.dropdown").dropdown({onChange: function(value) {
		var mode = $(this).data("mode");
		var field = $(this).data("field");
		var index = $(this).data("index").toString();
		var fieldName = mode+""+index+"-"+field.toString();
		$("input[name='"+fieldName+"']").val(value);
		$("input[name='"+fieldName+"']").trigger("change");
		$("select.dropdown").dropdown("refresh");
	}});
	$("select.dropdown").dropdown();
}

Template.step4.rendered = function() {
	$(".ui.checkbox").checkbox();
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
		blobs.splice(-1, 1);
		Session.set(sessionBlob, blobs);
	},
	"submit .ui.form": function(event) {
		event.preventDefault();
		var updateData = {};
		if(this.type == "Bandemonium") {
			var sundays = [];
			$('input[name="bandemonium-sunday"]:checked').each(function() {
				var value = parseInt($(this).val());
		   sundays.push(value);
			});
			updateData.badSundays = sundays;
		} else {
			var classConflicts = [];
			$('input[name="conflict-class"]:checked').each(function() {
				classConflicts.push($(this).val());
			});
			updateData.conflicts = {
				classes: classConflicts,
				other: Session.get("otherConflicts")
			};
			updateData.safeHarbor = $("[name='requestSafeHarbor']:checked").val();
			updateData.preferredLength = parseInt($("[name='preferredLength']:checked").val());
		}
		Meteor.call("updateShow", this._id, updateData);
		if(this.step <= 4) {
			Meteor.call("incrementStep", this._id, 5, function(error, result) {
				Router.go("shows.application", {_id: result, step: 5});
			});
		} else {
			Router.go("shows.application", {_id: this._id, step: 5});
		}
	},
	"click #goBackButton": function() {
		Router.go("shows.application", {_id: this._id, step: 3});
	}
})

Template.recurringBlock.events({
	// @todo dry this out
	"change input[name*='conflict']": function(event) {
		var index = event.currentTarget.dataset.index;
		var days = [];
		$('input[name="conflictDays-'+index+'"]:checked').each(function() {
			days.push($(this).val());
		});
		var start = $('input[name="conflict'+index+'-start"]').val();
		var end = $('input[name="conflict'+index+'-end"]').val();
		// Process these - End must be later than Start
		var endSplit = end.split(":");
		var startSplit = start.split(":");
		if(endSplit[0] > startSplit[0]) {
			end = (startSplit[1] == 30) ? (parseInt(startSplit[0]) + 1) + ":00" : startSplit[0] + ":30";
		} else if (endSplit[0] == startSplit[0] && startSplit[1] == 30) {
			end = (parseInt(startSplit[0]) + 1) + ":00";
		}

		// Save
		var conflicts = Session.get("otherConflicts");
		conflicts[index] = {days: days, start: start, end: end};
		Session.set("otherConflicts", conflicts);
	},
	"change input[name*='pref'], select[name*='pref']": function(event) {
		var index = event.currentTarget.dataset.index;
		var days = [];
		$('input[name="prefDays-'+index+'"]:checked').each(function() {
			days.push($(this).val());
		});
		var start = $('select[name="prefStart-'+index+'"]').val();
		var end = $('select[name="prefEnd-'+index+'"]').val();

		// Process these - End must be later than Start
		var endSplit = end.split(":");
		var startSplit = start.split(":");
		if(endSplit[0] < startSplit[0]) {
			end = (startSplit[1] == 30) ? (startSplit[0] + 1) + ":00" : startSplit[0] + ":30";
		} else if(endSplit[0] == startSplit[0] && startSplit[1] == 30) {
			end = (startSplit[0] + 1) + ":00";
		}

		// Save
		var prefs = Session.get("preferences");
		prefs[index] = {days: days, start: start, end: end};
		Session.set("preferences", prefs);
	}
})
