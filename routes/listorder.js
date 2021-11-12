const express = require('express');
const router = express.Router();
const sql = require('mssql');
const moment = require('moment');



router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.write('<title>ChaiMaMa Order List</title>');
    res.write('<h1>Order List</h1>');

    /**
    Useful code for formatting currency:
        let num = 2.87879778;
        num = num.toFixed(2);
    **/

    /** Write query to retrieve all order headers **/

    /** For each order in the results
            Print out the order header information
            Write a query to retrieve the products in the order

            For each product in the order
                Write out product information 
    **/
  
   /** Create connection, and validate that it connected successfully **/


    
   (async function() {
    try {
        let pool = await sql.connect(dbConfig);

        let sqlQuery1 = "SELECT o.orderId as ordId,o.orderDate,c.customerId,concat(firstName,' ',lastName) as name,totalAmount FROM customer c join ordersummary o on c.customerId = o.customerId";
        let results1 = await pool.request()
            .query(sqlQuery1);
        
        res.write("<table border = \"1\"><tr><th>Order Id</th><th>Order Date</th><th>Customer Id</th><th>Customer Name</th><th>Total Amount</th></tr>");
        for (let i = 0; i < results1.recordset.length; i++) {
             let result1 = results1.recordset[i];
             res.write("<tr><td>" + result1.ordId + "</td><td>" + moment(result1.orderDate).format('YYYY-mm-d HH:m:s') + "</td><td>" + result1.customerId + "</td><td>" + result1.name + "</td><td>" + result1.totalAmount + "</td></tr>");
             res.write("<tr align= \"right\" ><td colspan= \"5\"><table border = \"1\"; ><tr><th>Product Id</th><th>Quantity</th><th>Price</th></tr>");

             let sqlQuery2 = "SELECT productId, quantity, price from orderproduct where orderId =" + result1.ordId;
             let results2 = await pool.request()
                .query(sqlQuery2);

              for(let j=0; j <results2.recordset.length; j++){
                let result2 = results2.recordset[j];
                res.write("<tr><td>" + result2.productId + "</td><td>" + result2.quantity + "</td><td>" + result2.price + "</td></tr>");    
            }

             res.write("</table>");
             res.write("</td></tr>");
            }
         
            res.write("</table>");
            res.end();
        }
        

     catch(err) {
        console.dir(err);
        res.write(err)
        res.end();
}
})();


        next();

});
module.exports = router;
