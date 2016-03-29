Meteor.methods({
	finalValidateShow: function(showID) {
		// User must be signed in.
		if(Meteor.user() == null) {
			throw new Meteor.Error("not-authorized");
		}

		// Show must exist.
		var show = Shows.findOne({_id: showID});
		if(!show) {
			throw new Meteor.Error("show-does-not-exist");
		}

		// Time to start validating everything.
		// All DJs need to be good to go. The client is subscribed to DJ contact
		// details relevant to the show. (If they're not, then they're not calling
		// this Method properly, and so an error should be thrown.)
		var maxTerms = 0;
		var maxYear = 5;
		for(var i = 0; i < show.djs.length; i++) {

			// DJ-1: DJs must exist in database
			var thisDJ = DJs.findOne({netid: show.djs[i]});
			if(!thisDJ) throw new Meteor.Error("dj-validation-err-1", "DJ Validation Error (" + show.djs[i] + ", code 1)", "DJ validation error code 1 threw on " + show.djs[i] + ": DJ object does not exist. Please redo steps 1 (DJ list) and 2 (DJ Contact Details), and then try again.");

			// DJ-2: DJs must have their full name entered. This is validated with the following rules:
			// minimum length 5, must contain a space character
			if(thisDJ.name == null || thisDJ.name.length < 5 || thisDJ.name.indexOf(" ") == -1) throw new Meteor.Error("dj-validation-err-2", "DJ Validation Error (" + show.djs[i] + ", code 2)", "DJ validation error code 2 threw on " + show.djs[i] + ": Invalid name. Please complete the full contact details form in step 2 (DJ Contact Detilas), and then try again.");

			// DJ-3: DJs must have a class year between the current year, and four years from now.
			var currentYear = (new Date).getFullYear();
			if(thisDJ.year == null || thisDJ.year < currentYear || thisDJ.year > (currentYear + 4)) throw new Meteor.Error("dj-validation-err-3", "DJ Validation Error (" + show.djs[i] + ", code 3)", "DJ validation error code 3 threw on " + show.djs[i] + ": Invalid class year. Please return to step 2 (DJ Contact Details), correct the class year, and then try submitting your application again.");
			if((thisDJ.year - currentYear + 1) < maxYear) maxYear = (thisDJ.year - currentYear + 1);

			// DJ-4: DJs must have terms of experience between 0 and 12 inclusive
			if(thisDJ.terms == null || thisDJ.terms < 0 || thisDJ.terms > 12) throw new Meteor.Error("dj-validation-err-4", "DJ Validation Error (" + show.djs[i] + ", code 4)", "DJ validation error code 4 threw on " + show.djs[i] + ": Invalid terms of experience. Please return to step 2 (DJ Contact Details), correct the terms of experience, and then try submitting your application again.");
			if(thisDJ.terms > maxTerms) maxTerms = thisDJ.terms;

			// DJ-5: DJs must have a phone number on record.
			var nanpRegex = new RegExp("^(\()?([2-9][0-9]{2})(\))?[-. ]?([2-9](?!11)[0-9]{2})[-. ]?([0-9]{4})$");
			if(!nanpRegex.test(thisDJ.phone)) throw new Meteor.Error("dj-validation-err-5", "DJ Validation Error (" + show.djs[i] + ", code 5)", "DJ validation error code 5 threw on " + show.djs[i] + ": Invalid cell phone number. Please return to step 2 (DJ Contact Details), correct the cell phone number, and then try submitting your application again. If you do not have a U.S. cell phone number, please contact the Board of Directors.");

			// DJ-6: If DJs have a campus phone number, it must be valid.
			if(thisDJ.campusPhone != null) {
				if(thisDJ.campusPhone < 2000 || thisDJ.campusPhone >= 9000) throw new Meteor.Error("dj-validation-err-6", "DJ Validation Error (" + show.djs[i] + ", code 6)", "DJ validation error code 6 threw on " + show.djs[i] + ": Invalid campus phone number. Please return to step 2 (DJ Contact Details), correct or delete the campus phone number, and then try submitting your application again. Campus phone numbers are optional; please only submit one if you actually have a campus phone.");
			}
		}

		// Show content validation.
		// Some bits depend on what kind of show you've selected.
		if(show.type != "Bandemonium") {
			if(show.title == null || show.title.length < 3) throw new Meteor.Error("show-validation-err-1", "Show validation error (code 1)", "Title is missing or too short. Please return to step 3 (content), enter your show's title, and try again.");

			var dirtyWords = ["shit", "piss", "fuck", "cunt", "cocksucker", "tits"];
			for(var i = 0; i < dirtyWords.length; i++) {
				if(show.title.toLowerCase().indexOf(dirtyWords[i]) >= 0) throw new Meteor.Error("show-validation-err-2", "Show validation error (code 2)", "Your show title includes profanities that are not permitted by KRLX or FCC guidelines. Please change your show title in step 3 (content) and try again.");
			}

			if(show.description == null || show.description.length < 5) throw new Meteor.Error("show-validation-err-3", "Show validation error (code 3)", "You need to provide a description of your show. Please provide one in step 3 (content) and try submitting your application again.");

			// Since we're not Bandemonium, we've got more complex scheduling requirements.
			// If there are conflicts and/or preferences, the big issue is that end time
			// must be later than start time.
			if(show.conflicts != null) {
				if(show.conflicts.other != null) {
					var conflicts = show.conflicts.other;
					for(var i = 0; i < conflicts.length; i++) {
						var start = conflicts[i].start.split(":");
						var end = conflicts[i].end.split(":");
						if(parseInt(start[0]) > parseInt(end[0])) throw new Meteor.Error("scheduling-validation-err-1", "Scheduling validation error (code 1)", "Looks like one of your conflicts has its start time later than its end time. Please correct your conflict details and try submitting your application again.");
						if(parseInt(start[0]) == parseInt(end[0]) && parseInt(start[1]) == parseInt(end[1])) throw new Meteor.Error("scheduling-validation-err-2", "Scheduling validation error (code 2)", "Looks like one of your conflicts has its start time equal to its end time. Please change or correct your conflicts in the scheduling page. If you don't need that conflict, you can remove it.");
					}
				}
			}

			if(show.preferences != null) {
				var prefs = show.preferences;
				for(var i = 0; i < prefs.length; i++) {
					var start = prefs[i].start.split(":");
					var end = prefs[i].end.split(":");
					if(parseInt(start[0]) > parseInt(end[0])) throw new Meteor.Error("scheduling-validation-err-3", "Scheduling validation error (code 3)", "Looks like one of your preferences has its start time later than its end time. Please correct your preference details and try submitting your application again.");
					if(parseInt(start[0]) == parseInt(end[0]) && parseInt(start[1]) == parseInt(end[1])) throw new Meteor.Error("scheduling-validation-err-4", "Scheduling validation error (code 4)", "Looks like one of your preferences has its start time equal to its end time. Please change or correct your preferences in the scheduling page. If you don't need that preference entry, you can remove it.");
				}
			}
		} else {
			if(show.description == null || show.description.length < 100) throw new Meteor.Error("show-validation-err-3", "Show validation error (code 3)", "You need to provide a website description of your show. Please provide one in step 3 (content) and try submitting your application again. (Minimum length 100 characters)");

			if(show.why == null || show.why.length < 100) throw new Meteor.Error("show-validation-err-5", "Show validation error (code 5)", "You need to provide a reason for why you should be picked to host Bandemonium. Please provide one in step 3 (content) and try submitting your application again. (Minimum length 100 characters)");

			if(show.theme == null || show.theme.length == 0) throw new Meteor.Error("show-validation-err-6", "Show validation error (code 6)", "You need to provide the theme for your Bandemonium show. Please provide one in step 3 (content) and try submitting your application again.");
		}

		if(show.type == "Student Org") {
			if(show.sponsor == null || show.sponsor.length < 3) throw new Meteor.Error("show-validation-err-4", "Show validation error (code 4)", "Sponsor is missing or too short. Please return to step 3 (content), enter the student organization sponsoring this show, and try again.");
		}

		// Okay... looks good, save it!
		// Quick - compute the priority.
		var priority = "";
		if(show.type == "Student Org") {
			priority = "ORG ";
			if(maxTerms >= 10) maxTerms = 9;
			priority += (9 - maxTerms);
			priority += maxYear;
		}
		if(show.type == "Bandemonium") {
			priority = "BND ";
			if(maxTerms >= 10) maxTerms = 9;
			priority += (10 - maxTerms);
			priority += maxYear;
		}
		if(show.type == "Standard") {
			if(maxTerms >= 10) maxTerms = 9;
			var priorityLetters = ["J", "I", "H", "G", "F", "E", "D", "C", "B", "A"];
			priority = priorityLetters[maxTerms] + maxYear;
		}
		Shows.update({_id: showID}, {$set: {completed: new Date(), step: 6, priority: priority}});
		return showID;
	}
})
