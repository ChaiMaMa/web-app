const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const path = require('path');


// Imports route handlers
let loadData = require('./routes/loaddata');
let listOrder = require('./routes/account/listorder');
let listProd = require('./routes/products/listprod');
let addCart = require('./routes/checkout/addcart');
let showCart = require('./routes/checkout/showcart');
let checkout = require('./routes/checkout/checkout');
let order = require('./routes/checkout//order');
let login = require('./routes/authentication/login');
let logout = require('./routes/authentication/logout');
let validateLogin = require('./routes/authentication/validateLogin');
// let customer = require('./routes/account/customer');


// Create an express app
const app = express();

// This DB Config is accessible globally
dbConfig = {
  user: 'SA',
  password: process.env.SA_PASSWORD,
  server: process.env.DB_SERVER,
  database: 'tempdb',
  options: {
    'enableArithAbort': true,
    'encrypt': false,
  }
}

// Setting up JSON Parser
app.use(express.json()); // Parsing json string to js object
app.use(express.urlencoded({ extended: true })); // Parsing queries in POST http message (Content-Type: application/x-www-form-urlencoded)

// Setting up the session.
// This uses MemoryStorage which is not
// recommended for production use.
app.use(session({
  secret: 'COSC 304 Rules!',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: false,
    secure: false,
    maxAge: 60000,
  }
}))

// Setting up the rendering engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', './public')

// Setting up Express.js routes.
// These present a "route" on the URL of the site.
// Eg: http://127.0.0.1/loaddata
app.use('/loaddata', loadData);
app.use('/listorder', listOrder);
app.use('/listprod', listProd);
app.use('/addcart', addCart);
app.use('/showcart', showCart);
app.use('/checkout', checkout);
app.use('/order', order);
app.use('/login', login);
app.use('/logout', logout);
app.use('/validateLogin', validateLogin);
// app.use('/account', customer);
app.use('/images', express.static('public/images'));
app.use('/stylesheets', express.static('public/stylesheets'));
app.use('/js', express.static('public/javascripts'));

// Rendering the main page
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "public", "layouts", "index.html"));
})

// Starting our Express app
let port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server started on port ' + port));