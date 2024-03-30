require('dotenv').config();
var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
//const bodyParser = require('body-parser');
//const qrcode = require('qrcode');
//router.use(bodyParser.urlencoded({ extended: true }));
//router.use(bodyParser.json());
require('./passport');
router.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
	cookie:{
	name: 'google-auth-session',
    	keys: ['key1', 'key2']
	}
}));
router.use(passport.initialize());
router.use(passport.session());


var connection = mysql.createConnection({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  port: process.env.MYSQL_PORT || 3000,
  password: process.env.MYSQL_PASSWORD || 'FGCpassword2023',
  database: process.env.MYSQL_DATABASE || 'your_database_name',
  connectionLimit: 10
});

connection.connect(function(err){
  if(err)
       throw err;
  console.log('Connection established sucessfully');
});





//// Define the OTP URI with the secret and issuer
//const otpURI = 'otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&issuer=Example';
//
//// Define an Express route to handle displaying the QR code
//router.get('/qr-code', async (req, res) => {
//  try {
//    // Generate the QR code as a data URL
//    const qrCodeDataURL = await qrcode.toDataURL(otpURI);
//
//    // Send the response with the QR code image
//    res.send(`<img src="${qrCodeDataURL}"/>`);
//  } catch (error) {
//    // Handle any errors that occur
//
//    console.error(error);
//    res.status(500).send('Error generating QR code');
//  }
//});
//
//
//router.get('/qrcode', async (req, res) => {
//    res.render("qr");
//       });

// http://localhost:3000/
router.get('/',function(request,response,next) {
    try {
        const error = request.query.error;
        response.render('Main', { error });
    } catch(err) {
        response.render('error', { error: err });
    }
});

router.get('/Login',function(request,response,next) {
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

router.get('/Fog', function(request, response,next) {
	// Render login template
	 try {
     const error = request.query.error;
	 response.render('ForgotPass', { error });
	 } catch(err) {
             response.render('error', { error: err });
     }
});

router.post('/oauth', function(request, response) {
  // Capture the input fields
  let email = request.body.email;
  let password = request.body.password;

  // Define the correct admin username and password
  const adminUsername = "admin@admin.com";
  const adminPassword = "admin123";

  if (email && password) {
    connection.query('SELECT * FROM myapp.users WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
      if (results.length > 0) {
          if (email === adminUsername && password === adminPassword) {
          request.session.loggedin = true;
          response.redirect('/admin');
         } else {
          request.session.loggedin = true;
          request.session.userId = results[0].id;
          // Redirect to home page
          response.redirect('/home');
          }
      } else {
        response.redirect('/Login?error=Invalid Email or Password!');
      }
      response.end();
    });
  } else {
    response.redirect('/Login?error=Please enter Email and Password!');
    response.end();
  }
});



router.get('/auth/google' , passport.authenticate('google', { scope:
	[ 'email', 'profile' ]
}));


// Auth Callback
router.get( '/auth/callback',
	passport.authenticate( 'google', {
		successRedirect: '/auth/callback/success',
		failureRedirect: '/auth/callback/failure'
}));


router.get('/auth/callback/success' , (req , res) => {
	if(!req.user)
		res.redirect('/auth/callback/failure');
		req.session.loggedin = true;
	res.redirect('/home');
});

// failure
router.get('/auth/callback/failure' , (req , res) => {
	res.send("Error");
})

router.get('/auth/facebook',
    passport.authenticate('facebook', { authType: 'reauthenticate', scope: ['user_friends', 'manage_pages'] }));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/Login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('UserPage');
  });

router.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/Login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('UserPage');
  });

function isLoggedIn(req,res,next){
   if (request.isAuthenticated()) {
      return next();
   }
   response.redirect('/Login');
   }

router.get('/home',function(request,response){
 const userName = 'John';
    if (request.session.loggedin) {
            response.render('UserPage',{ userName: userName });
        } else {
            response.render('Login');
        }

});

router.get('/class',function(request,response){

    if (request.session.loggedin) {
            response.render('class-details');
        } else {
            response.render('Login');
        }
});

router.get('/blog',function(request,response){

    if (request.session.loggedin) {
            response.render('Blogs');
        } else {
            response.render('Login');
        }



});




router.get('/cart', function(req, res) {
  // Get the user ID from the session req.session.userId
  const userId = req.session.userId;

  // Fetch the user's order details from the database
  const query = `SELECT myapp.products.product_id, myapp.products.product_name, myapp.products.price, myapp.cart.quantity
                                  FROM myapp.cart
                                 JOIN myapp.products ON myapp.cart.product_id = myapp.products.product_id
                                 WHERE myapp.cart.user_id = ?`;
  connection.query(query, [userId], function(err, results) {
    if (err) throw err;

    // Calculate the total order amount
    let orderTotal = 0;
    results.forEach(function(detail) {
      orderTotal += detail.price * detail.quantity;
    });

    // Render the cart template with the order details and total amount
    res.render('cart', { orderDetails: results, orderTotal: orderTotal });
  });
});

router.get('/order', (req, res) => {
  const userId = req.session.userId;

  // Get all orders made by the user
  connection.query('SELECT * FROM myapp.orders WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, orders) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching orders');
    } else {
      res.render('orders', { orders });
    }
  });
});

router.post('/checkout', (req, res) => {
  const userId = req.session.userId;
  const { name, address, phone } = req.body;

  // Retrieve cart items for the user
  connection.query('SELECT * FROM myapp.cart WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving cart items');
    } else {
      // Insert new orders into orders table for each cart item
      results.forEach((cartItem) => {
        const { product_id, quantity } = cartItem;
        connection.query('INSERT INTO myapp.orders (user_id, product_id, quantity,name, address, phone) VALUES (?, ?, ?, ?, ?, ?)', [userId, product_id,quantity,name, address, phone], (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error creating order');
          } else {
            // Delete item from cart
            connection.query('DELETE FROM myapp.cart WHERE user_id = ? AND product_id = ?', [userId, product_id], (err, result) => {
              if (err) {
                console.error(err);
                res.status(500).send('Error removing item from cart');
              }
            });
          }
        });
      });
      res.redirect('/order');
    }
  });
});


router.get('/totalorder', function(req, res) {
  connection.query('SELECT * FROM myapp.orders', function(err, rows) {
    if (err) throw err;
    res.render('totalorder', { orders: rows });
  });
});


router.get('/team',function(request,response){

            response.render('team');

});


router.get('/profile',function(request,response){

            response.render('profile');

});

router.get('/clprofile',function(request,response){

            response.render('clientprofile');

});
router.get('/shop', (req, res) => {
  // Check if the user is logged in
  if (!req.session.loggedin) {
    res.render('Login');
    return;
  }

  // Write SQL query to fetch product data
  const productsQuery = 'SELECT * FROM myapp.products';

  // Execute query and pass results to view
  connection.query(productsQuery, (err, products) => {
    if (err) throw err;


    res.render('shop', {products});
  });
});


router.get('/adminshop', (req, res) => {
  // write SQL query to fetch product data
if (req.session.loggedin) {
  const userName = 'John';
  const productsQuery = 'SELECT * FROM myapp.products;';

  // execute query and pass results to view
  connection.query(productsQuery, (err, rows) => {
    if (err) throw err;
    res.render('adminshop', { userName: userName, products: rows });
  });
   } else {
              res.render('Login');
          }
});


router.post('/addstock', (req, res) => {
  const query = `UPDATE myapp.products SET stock = stock + 1 `;
  connection.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error adding stock to product');
    } else {
      res.redirect('/admin');
    }
  });
});


router.post('/addtocart', (req, res) => {
// req.session.userId
  const userId = req.session.userId;
  const productId = req.body.product_id;
  const quantity = req.body.quantity || 1;

  const query = 'INSERT INTO myapp.cart (user_id, product_id, quantity) VALUES (?, ?, ?)';
  connection.query(query, [userId, productId, quantity], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error adding item to cart');
    } else {
      res.redirect('/cart');
    }
  });
});

router.get('/admin', function(request, response) {
  if (request.session.loggedin) {
    connection.query('SELECT * FROM loginuser.userdata', function(err, userRows) {
      if (err) {
        response.render('Admin', { data: [], products: [] });
      } else {
        connection.query('SELECT name, price FROM loginuser.productdata', function(err, productRows) {
          if (err) {
            response.render('Admin', { data: [], products: [] });
          } else {
            // Extract the user data and product data from the results
            var userData = userRows.map(row => ({ Name: row.Name, Email: row.Email }));
            var productData = productRows.map(row => ({ ProductName: row.name, Price: row.price }));
            response.render('Admin', { data: userData, products: productData });
          }
        });
        }
    });
  } else {
    response.render('Login');
  }
});

router.post('/register', (request, response) => {
    let name = request.body.name;
    let email = request.body.email;
    let password = request.body.password;
   let passwordConfirm = request.body.passwordConfirm;
 if (password !== passwordConfirm) {
        response.render('error',{ message:'Password dont match'},(err, html) => {
        response.redirect('/Login');
        });
    }
     else {
        connection.query('INSERT INTO myapp.users (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err, results) => {
            if (err) {
                response.render('error', { error: err });
            } else {
                response.render('create_success', { toast: true }, (err, html) => {
                    response.redirect('/login?error=Successfully registered with email and password');
                });
            }
        });
    }
});

router.get('/logout', function(request, response) {
  request.logout(function(err) {
    if (err) {
      console.error('Error logging out:', err);
      return next(err);
    }
    request.session.destroy(function(err) {
      if (err) {
        console.error('Error destroying session:', err);
        return next(err);
      }
      response.redirect('/Login?error=Successfully Signed Out');
    });
  });
});

router.post('/update-status/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  const newStatus = req.body.status;

  connection.query('UPDATE myapp.orders SET status = ? WHERE id = ?', [newStatus, orderId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error updating order status');
    } else {
      res.redirect('/totalorder');
    }
  });
});



module.exports = router;