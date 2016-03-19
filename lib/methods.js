Meteor.methods({
	createShow: function(type, title) {
		// user must be logged in
		if(Meteor.user() == null) {
			throw new Meteor.Error("not-authorized");
		}

		var userNetID = Meteor.user().krlx.netid;

		// user cannot have more than ten incomplete applications at once
		if(Shows.find({owner: userNetID, completed: {$exists: false}}).count() >= 10) {
			throw new Meteor.Error("too-many-incomplete-applications");
		}

		// user must select a valid application type
		var validTypes = ["Standard", "Bandemonium", "Student Org"];
		if(validTypes.indexOf(type) == -1) {
			throw new Meteor.Error("invalid-type");
		}

		// show title cannot include any of the six (seven) dirty words
		var dirtyWords = ["shit", "piss", "fuck", "cunt", "cocksucker", "tits"];
		var temporaryTitle = title.toLowerCase().replace(/ /g, "");
		for(var i = 0; i < dirtyWords.length; i++) {
			if(temporaryTitle.indexOf(dirtyWords[i]) >= 0) {
				throw new Meteor.Error("fcc-dirty-words");
			}
		}

		// ok, looks good, save it.
		var newShowID = Shows.insert({
			type: type,
			title: title,
			owner: userNetID,
			djs: [userNetID],
			step: 1
		});

		return newShowID;
	}
});
