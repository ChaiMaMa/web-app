const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');

let loadData = require('./routes/loaddata');
let listOrder = require('./routes/account/listorder');
let listProd = require('./routes/products/listprod');
let addCart = require('./routes/checkout/addcart');
let showCart = require('./routes/checkout/showcart');
let checkout = require('./routes/checkout/checkout');
let order = require('./routes/checkout//order');
let product = require('./routes/products/product');

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/product', product);

// Rendering the main page
app.get('/', function (req, res) {
  res.render('index', {
    title: "ChaiMaMa"
  });
})

// Starting our Express app
app.listen(process.env.PORT || 3000, () => console.log('Server started on port ' + (process.env.PORT || 3000)));