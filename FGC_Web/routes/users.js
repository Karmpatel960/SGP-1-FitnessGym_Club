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


module.exports = router;