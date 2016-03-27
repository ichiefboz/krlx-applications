Template.step5.helpers({
	bandemonium: function() {
		return this.type == "Bandemonium";
	},
	contentData: function() {
		var data = [];
		if(this.type == "Bandemonium") {
			data = [
				{field: "Theme", data: this.theme},
				{field: "Website description", data: this.description},
				{field: "Why we should pick you", data: this.why},
			];
		} else {
			data = [
				{field: "Title", data: this.title},
				{field: "Genre/description", data: this.description}
			];
			if(this.type == "Student Org") data.unshift({field: "Sponsoring organization", data: this.sponsor})
		}
		return data;
	},
	disableButton: function() {
		return (this.completed == null || Session.get("djErrors") == true);
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
	},
	displayName: function(netid) {
		var dj = DJs.findOne({netid: netid});
		if(dj) {
			return dj.name ? dj.name : dj.netid;
		}
	},
	djCleared: function(netid, returnMode) {
		var dj = DJs.findOne({netid: netid});
		if(dj) {
			var errors = [];

			// Validate DJs, since this is the part where it's easy to go wrong.
			if(dj.name == null) {
				errors.push("Missing name");
			} else if(dj.name.length < 3) {
				errors.push("Missing or invalid name");
			}

			var currentYear = (new Date).getFullYear();
			if(dj.year < currentYear) errors.push("Invalid class year");
			if(dj.year > (currentYear + 5)) errors.push("Invalid class year");

			// Validate against US phone numbers with this god-awful regex
			var nanpRegex = new RegExp("^(\()?([2-9][0-9]{2})(\))?[-. ]?([2-9](?!11)[0-9]{2})[-. ]?([0-9]{4})$");
			if(!nanpRegex.test(dj.phone)) errors.push("Missing or invalid cell phone number");

			if(dj.campusPhone != null) {
				var campusPhone = parseInt(dj.campusPhone);
				if(campusPhone < 2000 || campusPhone >= 9000) errors.push("Invalid campus phone");
			}

			if(dj.terms == null) errors.push("Missing experience");
			if(dj.terms < 0 || dj.terms > 12) errors.push("Invalid experience");

			if(errors.length > 0) Session.set("djErrors", true);

			if(returnMode == "isOK") {
				return errors.length == 0;
			} else {
				if(errors.length == 1) {
					return errors[0];
				} else {
					return errors.length + " issues";
				}
			}
		}
	},
	schedulingData: function() {
		var data = [];
		if(this.type == "Bandemonium") {
			data = [{field: "Sundays with conflicts", data: this.badSundays.join(", ")}];
		} else {
			var safeHarborOptions = {yes: "Yes please", no: "No thanks", meh: "Meh, doesn't matter"}
			data = [
				{field: "Preferred length", data: this.preferredLength + " minutes"},
				{field: "Safe Harbor request", data: safeHarborOptions[this.safeHarbor]},
				{field: "Classes", data: this.conflicts.classes.join(", ")}
			];
		}
		return data;
	}
})

Template.step5.rendered = function() {
	Meteor.subscribe("djsInShow", this.data._id);
	$("#confirmModal").modal({onApprove: function() {
		Meteor.call("finalValidateShow", $("#yesImSureButton").data("show-id"), function(error, result) {
			if(result) {
				Router.go("shows.view", {_id: result});
			}
			if(error) {
				$("#errorModalHeader").text(error.reason);
				$("#errorModalContent").text(error.details);
				$(".ui.modal").modal("show");
			}
		});
	}})
}

Template.step5.created = function() {
	Session.set("djErrors", false);
}

Template.step5.events({
	"input .nameInput": function() {
		var disable = false;
		$(".nameInput").each(function() {
			var enteredValue = $(this).val();
			var expectedValue = $(this).data("match");
			if(enteredValue != expectedValue) disable = true;
		});
		$("#finishApplication").prop("disabled", disable);
	},
	"click .backTo": function(event) {
		var destination = parseInt(event.currentTarget.dataset.destination);
		Router.go("shows.application", {_id: this._id, step: destination});
	},
	"submit .ui.form": function(event) {
		event.preventDefault();
		$("#confirmModal").modal("show");
	}
})
