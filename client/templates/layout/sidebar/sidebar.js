Template.sidebar.helpers({
	userNetID: function() {
		if(Meteor.user()) {
			var email = Meteor.user().services.google.email;
			if(email) {
				return email.split("@")[0];
			}
		}
		return "";
	},
	userName: function() {
		if(Meteor.user()) {
			return Meteor.user().services.google.name;
		}
		return "";
	}
})
