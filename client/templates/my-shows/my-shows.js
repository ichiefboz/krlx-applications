Template.myShows.helpers({
	currentApplications: function() {
		return Shows.find({});
	},
	hasApplications: function() {
		return (Shows.find({}).count() > 0);
	}
})
