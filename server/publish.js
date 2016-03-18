Meteor.publish("users", function() {
	return Meteor.users.find({}, {fields: {
		"krlx": 1
	}})
})
