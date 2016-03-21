Template.myShows.helpers({
	currentApplications: function() {
		return Shows.find({});
	},
	hasApplications: function() {
		return (Shows.find({}).count() > 0);
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
