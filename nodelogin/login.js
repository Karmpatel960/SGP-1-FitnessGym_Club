const mysql = require('mysql');
const express = require('express');
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

const app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use("/photo",express.static("photo"));
app.use(express.json());
app.set('view engine', 'html');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));


// http://localhost:3000/
app.get('/', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/Login.html'));
});
app.get('/acc', function(request, response) {
	// Render login template
	 response.sendFile(path.join(__dirname + '/Create_Account.html'));
});


// http://localhost:3000/auth
app.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;

//    // Define the correct username and password
//    const correctUsername = "1000"
//    const correctPassword = "password"

    // Check if the user's input matches the correct values

	if (username && password) {
		connection.query('SELECT * FROM loginuser.userdata WHERE username = ? AND Password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}
			response.end();
		});
//	} else if (username === correctUsername && password === correctPassword) {
//	                       if (request.session.loggedin) {
//                                response.redirect('/admin'), {}, function (err) {
//                                    if(err){
//                                        response.status(404).send("File not found");
//                                    }
//                                });
//                          }
//  else {
//                                response.status(401).send('Please login to view this page!');
//                            }
//

     } else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});


app.get('/home', function(request,response){
    if (request.session.loggedin) {
            response.sendFile(path.join(__dirname + '/UserPage.html'));
        } else {
            response.redirect('/');
        }
});

app.get('/admin', function(request,response){
    if (request.session.loggedin) {
            response.sendFile(path.join(__dirname + '/Admin.html'));
        } else {
            response.redirect('/');
        }
});


app.listen(3000);