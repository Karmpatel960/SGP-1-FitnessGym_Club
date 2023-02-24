const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
var facebookAuth = require('passport-facebook');const facebookStrategy = facebook.Strategy;

//const uroute = require('users')
const config = require('FGC_Web/config/config.js')
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
		clientID: config.facebookAuth.clientID,
		clientSecret: config.facebookAuth.clientSecret,
		callbackURL: config.facebookAuth.clientURL
	},
	function(accessToken, refreshToken, profile, done) {
   return done(null,profile);
	}
));