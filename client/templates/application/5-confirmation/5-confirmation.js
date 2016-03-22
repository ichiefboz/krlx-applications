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
			]
		}
		return data;
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

			// Validate em.
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
	}
})

Template.step5.rendered = function() {
	Meteor.subscribe("djsInShow", this.data._id);
}

Template.step5.created = function() {
	Session.set("error-msgs", []);
}
