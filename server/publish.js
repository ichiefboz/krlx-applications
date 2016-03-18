Meteor.publish("allUsernames", function() {
	return Meteor.users.find({}, {fields: {
		"services.google.name": 1,
		"services.google.email": 1
	}})
})
