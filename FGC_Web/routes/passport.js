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
	clientID:"873557186995-36td1m1t3l9ub1qs6b2jl4ul1gav509h.apps.googleusercontent.com", // Your Credentials here.
	clientSecret:"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", // Your Credentials here.
	callbackURL:"http://localhost:3000/auth/callback",
	passReqToCallback:true
},
function(request, accessToken, refreshToken, profile, done) {
	return done(null, profile);
}
));

passport.use(new FacebookStrategy({
    clientID: '8840207599385587',
    clientSecret: '9ab8272097058065098e272b3c976bfc',
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.use(new GitHubStrategy({
    clientID: 'db7917eb573d031480cc',
    clientSecret: '53bd99c1bff8afc2a9eafd145064cc42eed884ae',
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));