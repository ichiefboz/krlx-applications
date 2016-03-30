Template.djList.created = function() {
	var cleared = false;
	if(Meteor.user()) {
		if(Meteor.user().krlx) {
			if(Meteor.user().krlx.board) cleared = true;
		}
	}

	// This is for board members only.
	if(!cleared) Router.go("shows.my.list");
}

Template.djList.helpers({
	list: function() {
		var includeDjsArray = [];
		var netids = [];
		var shows = Shows.find({}).collection._docs._map;
		for(var showID in shows) {
			var thisShowDjs = shows[showID].djs;
			for(var i = 0; i < thisShowDjs.length; i++) {
				if(netids.indexOf(thisShowDjs[i]) == -1) {
					includeDjsArray.push(DJs.findOne({netid: thisShowDjs[i]}));
					netids.push(thisShowDjs[i]);
				}
			}
		}
		includeDjsArray.sort(function(a, b) {
			return (a.terms == b.terms) ? (a.netid - b.netid) : (b.terms - a.terms);
		});
		return includeDjsArray;
	},
	newDJs: function() {
		var includeDjsArray = [];
		var netids = [];
		var shows = Shows.find({}).collection._docs._map;
		for(var showID in shows) {
			var thisShowDjs = shows[showID].djs;
			for(var i = 0; i < thisShowDjs.length; i++) {
				if(netids.indexOf(thisShowDjs[i]) == -1) {
					var djObject = DJs.findOne({netid: thisShowDjs[i]})
					if(djObject.terms == 0) {
						includeDjsArray.push(djObject);
					}
					netids.push(thisShowDjs[i]);
				}
			}
		}
		includeDjsArray.sort(function(a, b) {
			return a.netid - b.netid;
		});
		return includeDjsArray;
	}
})
