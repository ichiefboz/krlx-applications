Meteor.publish("users", function() {
	return Meteor.users.find({}, {fields: {
		"krlx": 1
	}});
});

Meteor.publish("myShows", function() {
	if(this.userId) {
		var userObject = Meteor.users.findOne({"_id": this.userId});
		if(userObject.krlx) {
			var netid = userObject.krlx.netid;
			return Shows.find({djs: {$in: [netid]}});
		} else {
			return this.ready();
		}
	} else {
		return this.ready();
	}
});

Meteor.publish("completedShows", function() {
	return Shows.find({completed: {$exists: true}});
});

Meteor.publish("completedShowsBasic", function() {
	return Shows.find({completed: {$exists: true}}, {fields: {title: 1}});
});

Meteor.publish("djsInShow", function(showID) {
	var show = Shows.findOne({_id: showID});
	return DJs.find({netid: {$in: show.djs}}, {fields: {
		"netid": 1,
		"name": 1,
		"email": 1,
		"phone": 1,
		"campusPhone": 1,
		"year": 1,
		"terms": 1
	}});
});

Meteor.publish("djBasicDetails", function() {
	return DJs.find({}, {fields: {
		"netid": 1,
		"name": 1,
		"terms": 1
	}})
});

Meteor.publish("djAdvDetails", function() {
	return DJs.find({}, {fields: {
		"netid": 1,
		"name": 1,
		"terms": 1,
		"year": 1,
		"board": 1,
		"phone": 1
	}})
})
