const express = require('express');
const router = express.Router();
const sql = require('mssql');
const moment = require('moment');



router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.write('<title>ChaiMaMa</title>');

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

        let sqlQuery1 = "SELECT orderId, orderDate, customer.customerId, concat(firstName,' ',lastName) as name, totalAmount FROM customer join ordersummary on customer.customerId = ordersummary.customerId";
        let results1 = await pool.request()
            .query(sqlQuery1);

        res.write("<h1>Order List</h1>");

        res.write("<table border=\"1\"><tbody><tr><th>Order Id</th><th>Order Date</th><th>Customer Id</th><th>Customer Name</th><th>Total Amount</th></tr>"); 
        
        for (let i = 0; i < results1.recordset.length; i++) {
            let result1 = results1.recordset[i];
            res.write("<tr><td>" + result1.orderId + "</td><td>" + moment(result1.orderDate).format("YYYY-mm-d HH:m:s") + "</td><td>" + result1.customerId + "</td><td>" + result1.name + "</td><td>" + result1.totalAmount + "</td>");
            let ordId = result1.orderId;
            let sqlQuery2 = "SELECT * from orderproduct where orderId=" + ordId;
            let results2 = await pool.request()
            .query(sqlQuery2);
            res.write("<tr align=\"right\"><td colspan=\"5\"><table border=\"1\">");
            res.write("<tr><th>Product Id</th><th>Quantity</th><th>Price</th></tr>");
             for(let j=0; j< results2.recordset.length; j++){
                 let result2 = results2.recordset[j];
                 res.write("<tr><td>" + result2.productId + "</td><td>" + result2.quantity + "</td><td>"+ "$" + result2.price.toFixed(2) + "</td>");
        }

        res.write("</table></td></tr>");
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
