const express = require('express');
const router = express.Router();
const sql = require('mssql');
const moment = require('moment');
const query = require('../utilities/query').query;

router.get('/', async function (req, res, next) {
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
    try {
        let results1 = await query("SELECT o.orderId as ordId,o.orderDate,c.customerId,concat(firstName,' ',lastName) as name,totalAmount, p.productId, p.quantity, price FROM customer c join ordersummary o on c.customerId = o.customerId join orderproduct p on p.orderId = o.orderId");
        let results2 = query("SELECT count(*) from orderproduct");
        res.write("<table><tr><th>Order Id</th><th>Order Date</th><th>Customer Id</th><th>Customer Name</th><th>Total Amount</th></tr>");
        for (let i = 0; i < results1.recordset.length; i++) {
            let result1 = results1.recordset[i];
            res.write("<tr><td>" + result1.ordId + "</td><td>" + result1.orderDate + "</td><td>" + result1.customerId + "</td><td>" + result1.name + "</td><td>" + result1.totalAmount + "</td></tr>");
        }
        res.write("</table>");
    } catch (err) {
        res.write(err.toString());
    }
    res.end();
});

module.exports = router;
