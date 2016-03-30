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
		if(type == "Bandemonium") {
			title = "Bandemonium";
		}

		// ok, looks good, save it.
		var newShowID = Shows.insert({
			type: type,
			title: title,
			owner: userNetID,
			djs: [userNetID],
			step: 1,
			createdAt: new Date(),
			term: "Spring 2016"
		});

		if(Meteor.isServer) {
			Email.send({
				to: userNetID + "@carleton.edu",
				from: "applications@krlx.org",
				replyTo: "tippetta@carleton.edu",
				subject: "[krlx] "+type+" Application Created Successfully",
				html: '<h1>Welcome aboard!</h1><p>Hey there! Your application for a KRLX show for Spring Term 2016 has been successfully created.</p><p>Our online application system allows you to save your application and come back to it later. Your application is saved automatically as you progress through it. In case you need to return to your application, just go to <a href="http://apply.krlx.org/shows">apply.krlx.org/shows</a> and click the blue edit button next to this show (which is currently titled "'+title+'").</p><p><strong>Applications are due Saturday, April 2, 2016 at 12:01 AM.</strong> Be sure to sign and submit your application by then to ensure your seniority is honored.</p><p>Your show ID is <code>['+newShowID+']</code>. If you have problems with your application, email boslert, and be sure to include your show ID.</p><p>Thanks, and we\'re excited to hear your show on the radio!</p><p><em>This email was automatically generated from an address that cannot accept replies. If you have questions, please email tippetta (station manager) or boslert (IT engineer).</em></p>'
			});
		}

		return newShowID;
	},

	deleteShow: function(showID) {
		// user must be logged in
		if(Meteor.user() == null) {
			throw new Meteor.Error("not-signed-in");
		}

		var userNetID = Meteor.user().krlx.netid;

		// user must own the application in order to delete it.
		// Non-owner DJs can edit an application but only an owner can delete it.
		var show = Shows.findOne({_id: showID});

		if(!show) {
			throw new Meteor.Error("show-does-not-exist");
		}

		if(show.owner == userNetID) {
			Shows.remove({_id: showID});
		} else {
			throw new Meteor.Error("must-be-owner");
		}
	},

	updateShowStep1: function(showID, newDJs) {
		// must be signed in
		if(Meteor.user() == null) {
			throw new Meteor.Error("not-signed-in");
		}

		var show = Shows.findOne({_id: showID});
		// show must exist
		if(!show) {
			throw new Meteor.Error("show-does-not-exist");
		}

		// new DJs must be an array
		if(!Array.isArray(newDJs)) {
			throw new Meteor.Error("new-djs-must-be-array");
		}

		var djs = [];
		// validate to meet carleton standard: [at least 3 letters] [optional number] @
		for(var i = 0; i < newDJs.length; i++) {
			if(newDJs[i].match(/^([a-z]){3,}([0-9])*(@carleton\.edu)?$/)) {
				var newVal = "";
				if(newDJs[i].indexOf("@") != -1) {
					newVal = newDJs[i].split("@")[0];
				} else {
					newVal = newDJs[i];
				}
				djs.push(newVal);
			}
		}

		if(djs.length > 0) {
			Shows.update({_id: showID}, {$set: {djs: djs}});
			if(show.step == 1) Shows.update({_id: showID}, {$set: {step: 2}});

			for(var i = 0; i < djs.length; i++) {
				var newVal = djs[i];
				DJs.upsert({netid: newVal}, {$set: {netid: newVal, email: newVal + "@carleton.edu"}});
			}

			return showID;
		} else {
			throw new Meteor.Error("invalid-djs");
		}
	},

	updateDJ: function(netid, data) {
		DJs.update({netid: netid}, {$set: data});
		return netid;
	},

	incrementStep: function(showID, newStep) {
		Shows.update({_id: showID}, {$set: {step: newStep}});
		return showID;
	},

	updateShow: function(showID, data) {
		// must be signed in
		if(Meteor.user() == null) {
			throw new Meteor.Error("not-signed-in");
		}

		var show = Shows.findOne({_id: showID});
		// show must exist
		if(!show) {
			throw new Meteor.Error("show-does-not-exist");
		}

		// okay, now update the show
		Shows.update({_id: showID}, {$set: data});
		return showID;
	},

	numberOfCompletedShows: function() {
		var returnData = Shows.find({completed: {$exists: true}}).count();
		return returnData;
	}
});
