var express = require('express');
var router = express.Router();
const passport = require('passport');
const path = require('path');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('UserPage',{
  user:req.user
  });
});
router.get('/user', function(req, res, next) {
  res.render('Login');
});

router.get('/auth/facebook',passport.authenticate('facebook',{
  scope:['public_profile','email']
}));

router.get('/auth/facebook/callback',
	passport.authenticate('facebook', {failureRedirect: '/fail'}),
	function(req, res) {
		// Successful authentication, redirect home
		res.redirect('/user');
	});

function isLoggedIn(req,res,next){
   if (request.isAuthenticated()) {
      return next();
   }
   response.redirect('/');
   }

   router.get('/signout', function(request, response) {
          request.logout();
         request.session.loggedin = false;
         request.session = null;
                 response.redirect('/?error=Successfully Signed Out');

    });


module.exports = router;