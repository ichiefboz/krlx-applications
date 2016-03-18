Accounts.onCreateUser(function(options, user){
	// Require Google registration
	if(!user.services.google) {
    throw new Error('Expected login with Google only.');
  }

	var email = user.services.google.email;

	// Require Carleton email address
	if(email.indexOf("@carleton.edu") == -1) {
		throw new Error("Expected login with Carleton email address.");
	}

	user.krlx = {
		email: email,
		netid: email.split("@")[0],
		name: user.services.google.name
	};

	return user;
});
