const express = require('express');
const router = express.Router();
const sql = require('mssql');
const moment = require('moment');



router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.write('<title>YOUR NAME Grocery Order List</title>');

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

        let sqlQuery1 = "SELECT o.orderId as ordId,o.orderDate,c.customerId,concat(firstName,' ',lastName) as name,totalAmount, p.productId, p.quantity, price FROM customer c join ordersummary o on c.customerId = o.customerId join orderproduct p on p.orderId = o.orderId";
        let results1 = await pool.request()
            .query(sqlQuery1);
        let sqlQuery2 = "SELECT count(*) from orderproduct";
        let results2 = await pool.request()
            .query(sqlQuery2);
        res.write("<table><tr><th>Order Id</th><th>Order Date</th><th>Customer Id</th><th>Customer Name</th><th>Total Amount</th></tr>");
        for (let i = 0; i < results1.recordset.length; i++) {
             let result1 = results1.recordset[i];
             for(let j=0; j< result
             if(result1.ordId == result)
             res.write("<tr><td>" + result1.ordId + "</td><td>" + result1.orderDate + "</td><td>" + result1.customerId + "</td><td>" + result1.name + "</td><td>" + result1.totalAmount + "</td></tr>");
        }
    
        res.write("</table>");

        res.end();
    } catch(err) {
        console.dir(err);
        res.write(err)
        res.end();
}
})();


        next();

});
module.exports = router;
