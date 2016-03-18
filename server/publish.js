Meteor.publish("allUsernames", function() {
	return Meteor.users.find({}, {fields: {
		"krlx": 1
	}})
})
