# KRLX Application Center
A modernization of KRLX radio show applications

This project is a Meteor web application to allow Carleton students to create and manage applications for our campus radio station.

## How to run locally
If you're interested in running this application locally, follow these steps:

1. Make sure you've got Node.js on your machine. This app is being built with Node.js 4.2.4, but it may work on older versions (your mileage may vary).
2. Install Meteor. On Linux and OS X, run `curl https://install.meteor.com/ | sh` in your terminal. Windows users can download the Meteor installer from <https://meteor.com/install>.
3. Clone the repository and expand if necessary.
4. Switch into your project directory and run the `meteor` command. This will initialize everything and download the correct packages. **Be warned: This process may take a while the first time**, since CSS files will need to be generated.
5. Connect to your Meteor database in your terminal by running `meteor mongo`.
6. Create a Google OAuth client ID and secret at <https://console.developers.google.com>. Make sure you allow requests from `http://localhost:3000` and send OAuth callbacks to `http://localhost:3000/_oauth/google`. Full instructions for how to do this are on the wiki. Once you have these credentials, store them in your database by running the following command in your terminal:
```
db.meteor_accounts_loginServiceConfiguration.upsert({service: "google"}, {
  "clientId" : "YOUR_CLIENT_ID",
  "secret" : "YOUR_SECRET",
  "loginStyle" : "popup"
});
```

Finally, you can go to `localhost:3000` in your browser. If you see a sidebar on the left and "Welcome to KRLX" on the right, you've installed the project correctly.

**Be warned: This system ONLY works with a Carleton account!** This is because the `hd` flag for Google login is set to `carleton.edu` at all locations where login is used.

# Contributing
I greatly appreciate contributions to the project and will review and accept pull requests. Please do check out the wiki for the "spec sheet" of what the project will accomplish in full.
