Template.errorModal.helpers({
	contains: function(item) {
		return (this.flags.indexOf(item) >= 0);
	}
})

Template.errorModal.rendered = function() {
	if(this.data.flags) {
		if(this.data.flags.indexOf("signin") >= 0) {
			$("#error-"+this.data.code).modal({
				onApprove : function() {
					Meteor.loginWithGoogle({
						loginUrlParameters: {
							hd: "carleton.edu"
						}
					});
		    }
			});
		}
		if(this.data.flags.indexOf("myshows") >= 0) {
			$("#error-"+this.data.code).modal({
				onApprove : function() {
					Router.go("shows.my.list");
		    }
			});
		}
	}
}
