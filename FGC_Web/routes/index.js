var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const session = require('express-session');
//var flash = require('express-flash');
const path = require('path');
var flash = require('connect-flash');
router.use(flash());

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
router.use(flash());

router.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

// http://localhost:3000/
router.get('/', function(request, response) {
	// Render login template
	response.sendFile("Login.html", { root: './public/' })

});
router.get('/acc', function(request, response) {
	// Render login template
	 response.sendFile("Create_Account.html", { root: './public/' })
});

router.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;

    // Define the correct username and password
    const correctUsername = "1000"
    const correctPassword = "password"

    // Check if the user's input matches the correct values
	if (username && password) {
		connection.query('SELECT * FROM loginuser.userdata WHERE username = ? AND Password = ?', [username, password], function(error, results, fields) {

			if (results.length > 0) {
				if (username === correctUsername && password === correctPassword) {
				    request.session.loggedin = true;
					if (request.session.loggedin) {
						response.redirect('/admin', {}, function (err) {
							if(err){
								response.status(404).send("File not found");
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
				 response.send('Invalid Username and Password!');
			}
			response.end();
		});

     } else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

router.get('/home', function(request,response){
    if (request.session.loggedin) {
            response.sendFile("UserPage.html", { root: './public/' })
        } else {
            response.sendFile("Login.html", { root: './public/' })
        }
});

router.get('/admin', function(request,response){
    if (request.session.loggedin) {
            response.sendFile("Admin.html", { root: './public/' })
        } else {
            response.sendFile("Login.html", { root: './public/' })
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
    response.send('Password dont match');
    } else{
        connection.query('INSERT INTO loginuser.userdata SET ?', { Username:Username,syst: syst,Name: Name,Password: Password, Email: Email}, (err, results) => {
         request.flash('success', 'Your account has been created successfully');
         if (results.length > 0) {
          response.redirect('/')
          }
          else {
            console.log(err);
          }
        });
    }
    response.redirect('/')
 });
 router.get('/signout', function(request, response) {
     request.session.loggedin = false;
     request.flash('Successfully Signed Out');
 	 response.sendFile("Login.html", { root: './public/' })

 });

module.exports = router;
