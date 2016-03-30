Template.allShows.helpers({
	anyShows: function() {
		return Shows.find({}).count() > 0;
	},
	shows: function() {
		return this;
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

Template.allShows.events({
	"click #downloadShows": function() {
		var showData = Shows.find({}, {sort: {board: -1, type: -1, priority: 1, completed: 1}}).collection._docs._map;
		var returnData = [];
		for(var show in showData) {
			returnData.push(show);
		}
		var showList = returnData.join("|");
		Router.go("shows.download", {shows: showList});
	},
	"click .downloadSingleShow": function(event) {
		var showID = event.currentTarget.dataset.showid;
		Router.go("shows.download", {shows: showID});
	}
})
