Meteor.publish("users", function() {
	return Meteor.users.find({}, {fields: {
		"krlx": 1
	}});
});

Meteor.publish("myShows", function() {
	if(this.userId) {
		var userNetID = Meteor.users.findOne({"_id": this.userId});
		return Shows.find({});
	} else {
		return this.ready();
	}
})
