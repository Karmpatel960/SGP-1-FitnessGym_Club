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

app.post('/auth', function(request, response) {
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

app.post('/register', (req, res) => {
  const {Name,Username,email,password,passwordConfirm} = req.body;
//  connection.query('SELECT email from loginuser.userdata WHERE email = ?', [email], async (err, results) => {
//    if (err) {
//      console.log(err);
//    } else {
//      if (results.length > 0) {
//        return res.render("Create_Account", {
//          message: 'The email is already in use'
//        })
//      } else if (password !== passwordConfirm) {
//        return res.render("Create_Account", {
//          message: 'Password dont match'
//        });
//      }
//    }
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