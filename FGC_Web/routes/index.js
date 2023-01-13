var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const session = require('express-session');
const path = require('path');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'karmpatel2003',
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
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
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

router.post('/register', (req, res) => {
  const {Username,Name,email,password,passwordConfirm} = req.body;
  connection.query('SELECT email from loginuser.userdata WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.log(err);
    } else {
      if (results.length > 0) {
        return res.render("Create_Account", {
          message: 'The email is already in use'
        })
      } else if (password !== passwordConfirm) {
        return res.render("Create_Account", {
          message: 'Password dont match'
        });
      }
    }
    const sysT = 'T';
//    INSERT INTO `loginuser`.`userdata` (`Username`, `syst`, `Name`, `Password`, `Email`) VALUES ('900', 'T', 'Row', 'Roy4', 'row2');
    connection.query('INSERT INTO loginuser.userdata SET ?', { Username:Username,sysT:sysT,Name: Name,Password: Password, Email: Email}, (err, results) => {
      if (err) {
        console.log(err);
      } else {
        return res.render("Create_Account", {
          message: 'User registered'
        });
      }
    });
    res.redirect('/');
 });
 router.get('/signout', function(request, response) {
     request.session.loggedin = false;
 	 response.sendFile("Login.html", { root: './public/' })
 });

module.exports = router;
