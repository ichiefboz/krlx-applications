Template.step2.helpers({
	getDJData: function(target) {
		return DJs.findOne({netid: target});
	}
})

Template.step2.rendered = function() {
	Meteor.subscribe("djsInShow", this.data._id);
}
