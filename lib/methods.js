Meteor.methods({
	createShow: function(type) {
		// user must be logged in
		if(!Meteor.userId) {
			throw new Meteor.Error("not-authorized");
		}

		var userNetID = Meteor.user().krlx.netid;

		// user cannot have more than five incomplete applications at once
		if(Shows.find({owner: userNetID, completed: {$exists: false}}).count() >= 5) {
			throw new Meteor.Error("too-many-incomplete-applications");
		}

		// user must select a valid application type
		var validTypes = ["Standard", "Bandemonium", "Student Org"];
		if(validTypes.indexOf(type) == -1) {
			throw new Meteor.Error("invalid-type");
		}

		// ok, looks good, save it.
		var newShowID = Shows.insert({
			type: type,
			owner: userNetID,
			djs: [userNetID],
			step: 1,
			title: "Untitled Show"
		});

		return newShowID;
	}
});
