Template.myShows.helpers({
	activeApplications: function() {
		if(Meteor.user()) {
			var netid = Meteor.user().krlx.netid;
			return Shows.find({completed: {$exists: false}, djs: {$in: [netid]}});
		}
	},
	completedApplications: function() {
		if(Meteor.user()) {
			var netid = Meteor.user().krlx.netid;
			return Shows.find({completed: {$exists: true}, djs: {$in: [netid]}});
		}
	},
	hasActiveApplications: function() {
		if(Meteor.user()) {
			var netid = Meteor.user().krlx.netid;
			return Shows.find({completed: {$exists: false}, djs: {$in: [netid]}}).count() > 0;
		}
	},
	hasCompletedApplications: function() {
		if(Meteor.user()) {
			var netid = Meteor.user().krlx.netid;
			return Shows.find({completed: {$exists: true}, djs: {$in: [netid]}}).count() > 0;
		}
	},
	hasAnyApplications: function() {
		if(Meteor.user()) {
			var netid = Meteor.user().krlx.netid;
			return Shows.find({djs: {$in: [netid]}});
		};
	},
	isOwner: function() {
		return (this.owner == Meteor.user().krlx.netid);
	},
	displayName: function(netid) {
		var dj = DJs.findOne({netid: netid});
		return (dj.name == null) ? netid : dj.name;
	},
	showStatus: function() {
		return (this.completed) ? "Submitted (priority " + this.priority + ")" : "Incomplete";
	}
})

Template.myShows.events({
	"click .delete-show": function(event) {
		$("#delete-show-name").text(this.title);
		$("#delete-show-id").text(this._id);
		$("#delete-show-modal").modal({
			onApprove : function() {
				var showID = $("#delete-show-id").text();
				Meteor.call("deleteShow", showID);
			}
		});
		$("#delete-show-modal").modal("show");
	}
})
