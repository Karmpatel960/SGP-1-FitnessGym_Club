var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const session = require('express-session');
const path = require('path');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'FGCpassword2023',
  connectionLimit: 10
});
connection.connect(function(err){
  if(err)
       throw err;
  console.log('Connection established sucessfully');
});

router.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

// http://localhost:3000/
router.get('/', function(request,response,next) {
    try {
        const error = request.query.error;
        response.render('Login', { error });
    } catch(err) {
        response.render('error', { error: err });
    }
});


router.get('/acc', function(request, response,next) {
	// Render login template
	 try {
     const error = request.query.error;
	 response.render('Create_Account', { error });
	 } catch(err) {
             response.render('error', { error: err });
     }
});

router.post('/auth', function(request,response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;

    // Define the correct username and password
    const correctUsername = "1000"
    const correctPassword = "password"


	if (username && password) {
		connection.query('SELECT * FROM loginuser.userdata WHERE username = ? AND Password = ?', [username, password], function(error, results, fields) {

			if (results.length > 0) {
				if (username === correctUsername && password === correctPassword) {
				    request.session.loggedin = true;
					if (request.session.loggedin) {
						response.redirect('/admin', {}, function (err) {
							if(err){
							    response.render('error', { message: 'File not found' });
							}
						});
					} else {
                     response.redirect('/');
					}
				} else {
					// Authenticate the user
					request.session.loggedin = true;
					request.session.username = username;
					// Redirect to home page
					response.redirect('/home');
				}
			} else {
			     response.redirect('/?error=Invalid Username and Password!');
			}
			response.end();
		});

     } else {
        response.redirect('/?error=Please enter Username and Password!');
		response.end();
	}
});

router.get('/home', function(request,response){
    if (request.session.loggedin) {
            response.render('UserPage');
        } else {
            response.render('Login');
        }
});

router.get('/admin', function(request,response){
    if (request.session.loggedin) {
            response.render('Admin');
        } else {
            response.render('Login');
        }
});






router.post('/register', (request, response) => {
    let Name = request.body.Name;
    let Username = request.body.Username;
    let Password = request.body.Password;
    let Email = request.body.Email;
    let passwordConfirm = request.body.passwordConfirm;
    const syst = 'T';

    if (Password !== passwordConfirm) {
        response.render('error',{ message:'Password dont match'},(err, html) => {
        response.redirect('/');
        });
    } else {
        connection.query('INSERT INTO loginuser.userdata SET ?', { Username:Username,syst: syst,Name: Name,Password: Password, Email: Email}, (err, results) => {
            if (err) {
                response.render('error', { error: err });
            } else {
              response.render('Create_success',{toast: true}, (err, html) => {
                  response.redirect('/');
              });
          }
        });
    }
});

 router.get('/signout', function(request, response) {
     request.session.loggedin = false;
      response.redirect('/?error=Successfully Signed Out');
 });


module.exports = router;