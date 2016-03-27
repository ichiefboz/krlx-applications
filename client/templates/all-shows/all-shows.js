Template.allShows.helpers({
	shows: function() {
		return Shows.find({}, {sort: {type: -1, priority: 1, completed: 1}});
	},
	displayName: function(netid) {
		var dj = DJs.findOne({netid: netid});
		return (dj.name == null) ? netid : dj.name;
	}
})

Template.allShows.created = function() {
	var cleared = false;
	if(Meteor.user()) {
		if(Meteor.user().krlx) {
			if(Meteor.user().krlx.board) cleared = true;
		}
	}

	// This is for board members only.
	if(!cleared) Router.go("shows.my.list");
}
