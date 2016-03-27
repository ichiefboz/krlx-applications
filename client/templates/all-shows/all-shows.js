Template.allShows.helpers({
	shows: function() {
		return Shows.find({}, {sort: {type: -1, priority: 1, completed: 1}});
	},
	displayName: function(netid) {
		var dj = DJs.findOne({netid: netid});
		return (dj.name == null) ? netid : dj.name;
	}
})
