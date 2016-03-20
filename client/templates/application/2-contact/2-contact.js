Template.step2.helpers({
	getDJData: function(target) {
		return DJs.findOne({netid: target});
	}
})

Template.step2.rendered = function() {
	Meteor.subscribe("djsInShow", this.data._id);
}

Template.contactForm.helpers({
	displayName: function() {
		return (this.name == null) ? this.netid : this.name;
	},
	selected: function(value) {
		return (this.year == value) ? "selected" : "";
	},
	years: function() {
		var year = (new Date).getFullYear();
		var years = [];
		for(var i = 0; i < 5; i++) {
			years.push(year + i);
		}
		return years;
	}
})

Template.contactForm.rendered = function() {
	$("select.dropdown").dropdown();
}
