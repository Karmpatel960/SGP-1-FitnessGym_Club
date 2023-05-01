const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
passport.serializeUser((user , done) => {
	done(null , user);
})
passport.deserializeUser(function(user, done) {
	done(null, user);
});

passport.use(new GoogleStrategy({
	clientID:"8735571XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // Your Credentials here.
	clientSecret:"GOCSXXXXXXXXXXXXXXXXXXXXXXXXXX", // Your Credentials here.
	callbackURL:"http://localhost:3000/auth/callback",
	passReqToCallback:true
},
function(request, accessToken, refreshToken, profile, done) {
	return done(null, profile);
}
));

passport.use(new FacebookStrategy({
    clientID: '8XXXXXXXXXXXXXXXXXXXXXXXXXX',
    clientSecret: '9abXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.use(new GitHubStrategy({
    clientID: 'db791XXXXXXXXXXXXXXXXXXX',
    clientSecret: '53bd99XXXXXXXXXXXXXXXXXXXXX',
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));