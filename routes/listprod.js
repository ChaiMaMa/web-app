const express = require('express');
const router = express.Router();
const sql = require('mssql');

dbConfig = {
    user: 'keizo',
    password: 'KeizoKato427pop!',
    server: 'sql304.ok.ubc.ca',
    database: 'Product',
    options: {
      'enableArithAbort': true,
      'encrypt': false,
    }
}



router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');

 (async function(){
 try{
    let pool = await sql.connect(dbConfig)

    //get method 
    res.write(`
    <head>
        <title>YOUR NAME Grocery</title>
    </head>
    <body>
        <h1>Search for the products you want to buy:</h1>
        <form action="/listprod" method="get">
            <input type="text" name="productName" size="50">
            <input type="submit" value="Search">
            <input type="reset" value="Reset">
            <p>(Leave blank for all products)</p>
        </form>
        <h1>All Products</h1>
    `);


    // Get the product name to search for
    let name = req.query.productName;
    

    /** $name now contains the search string the user entered
     Use it to build a query and print out the results. */
    let nameSerchlist = "SELECT name,price FROM Product"

    //HTML format for table of products
     res.write(`
        <table>
            <tr>
                <th></th>
                <th>Product Name</th>
                <th>Price</th>
            </tr>
    `);

    //case 1: the user types the productName-> print the products's name and price || case 2: the user types nothing list products' names and prices
    if(name =! null && !name.equals("")){
        let SQLSt = await pool.request().query(nameSerchlist + "where name Like '%"+name+"%'")
        
        let printProduct = res.write(`
        <tr>
                <td>
                    <a href="/addcart?id=${nameSerchlist.productId}&name=${nameSerchlist.productName}&price=${product.productPrice}">Add to cart</a>
                </td>
                <td>${SQLSt.productName}</td>
                <td>${SQLSt.productPrice}</td>
        </tr>
       `);

        
    }else{
        for (let nameSerchlist of nameSerchlist.recordset) {
            printProduct;
        }
    }
    
    /** Create and validate connection **/

    /** Print out the table of products **/
     /** 
    For each product create a link of the form
    addcart?id=<productId>&name=<productName>&price=<productPrice>
    **/
   





    
      /* Useful code for formatting currency:
        let num = 2.89999;
        num = num.toFixed(2);
    **/

    res.end();



 }catch(error){
    console.dir(err);
            res.write(err)
            res.end();
    }
}
 

);})


module.exports = router;
