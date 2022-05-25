// Core
const express = require('express');

// Temlate engine
const exphbs = require('express-handlebars');

// Session store
const session = require('express-session');
const redis = require('redis')
const RedisStore = require('connect-redis')(session)

// Security
const helmet = require('helmet');

// Utility
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
let product = require('./routes/products/product');
let displayImage = require('./routes/products/displayImage');
let account = require('./routes/account/account');
let customer = require('./routes/admin/customer');
let adminOrder = require('./routes/admin/orders');
let inventory = require('./routes/admin/inventory');
let adminProduct = require('./routes/admin/products');
let adminShipment = require('./routes/admin/shipment');
let productUpdate = require('./routes/admin/product-update');
let confirm = require('./routes/checkout/confirm');
let payment = require('./routes/checkout/payment');

// Create an express app
const app = express();

// This DB Config is accessible globally
dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    enableArithAbort: true,
    encrypt: true,
    abortTransactionOnError: true
  }
}

// Set up proxy configuration
// Client’s IP address is understood as the left-most entry in the X-Forwarded-For header
app.set('trust proxy', true);

// Setting up the rendering engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'public'));

// Setting up the session.
// Redis is used as the session store.
const redisClient = redis.createClient(
  {
    url: process.env.REDIS_URL
  }
);
app.use(session({
  store: new RedisStore({
    client: redisClient
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: false,
    secure: false,
    maxAge: 1 * 60 * 60 * 1000, // Expire after 1 hour
  }
}))

// Setting up JSON Parser
app.use(express.json()); // Parsing json string to js object
app.use(express.urlencoded({ extended: true })); // Parsing queries in POST http message (Content-Type: application/x-www-form-urlencoded)

// Set up security enhancement (secure format of HTTP Response headers)
// Check Helmet doc: https://www.npmjs.com/package/helmet
app.use(helmet);

// Setting up Express.js routes.
// These present a "route" on the URL of the site.
// Eg: http://127.0.0.1/loaddata (local development environment)
if (process.env.NODE_ENV != 'production') { app.use('/loaddata', loadData); }
app.use('/listorder', listOrder);
app.use('/listprod', listProd);
app.use('/addcart', addCart);
app.use('/showcart', showCart);
app.use('/checkout', checkout);
app.use('/order', order);
app.use('/login', login);
app.use('/logout', logout);
app.use('/validateLogin', validateLogin);
app.use('/images', express.static('public/images'));
app.use('/stylesheets', express.static('public/stylesheets'));
app.use('/js', express.static('public/javascripts'));
app.use('/fonts', express.static('public/fonts'));
app.use('/product', product);
app.use('/displayImage', displayImage);
app.use('/account', account);
app.use('/admin/customer', customer);
app.use('/admin/orders', adminOrder);
app.use('/admin/inventory', inventory);
app.use('/admin/products', adminProduct);
app.use('/admin/shipment', adminShipment);
app.use('/admin/shipment', adminShipment);
app.use('/admin/product-update', productUpdate);
app.use('/confirmation', confirm);
app.use('/payment', payment);

// Rendering the main page
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "public", "layouts", "index.html"));
})

// Starting our Express app
let port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server started on port ' + port));