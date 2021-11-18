const express = require('express');
const router = express.Router();
const moment = require('moment');
const sql = require('mssql');
const query = require('../utilities/query').query;
const update = require('../utilities/query').update;
const isNumeric = require('../utilities/validators').isNumeric;
const { ValidationError, PropertyRequiredError, UserNotFoundError } = require('../utilities/errors');

router.get('/', async function (req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<title>Chai MaMa Order Processing</title>");
    try {
        /** 
         * Product list is an object with keys being the product id and the value being the product object.
         * Each entry (product object) in the productList is an object with key values: id, name, quantity, price 
         **/
        let productList = req.session.productList;
        let customerId = req.query.customerId;
        /**
            Determine if valid customer id was entered
            Determine if there are products in the shopping cart
            If either are not true, display an error message
        **/
        if (!productList) {
            throw new PropertyRequiredError("ProductList");
        } else if (!customerId) {
            throw new PropertyRequiredError("CustomerID");
        } else if (!isNumeric(customerId)) {
            throw new ValidationError("Customer ID");
        }

        /** Make connection and validate **/
        let customer = await query(`SELECT * FROM customer 
                                        WHERE customerId = @customerId`,
            { customerId: customerId });

        /**
         * If a customer is not found, display an error message.
         */
        if (customer.recordset.length === 0) {
            throw new UserNotFoundError(customerId);
        }

        let customerInfo = customer.recordset[0];
        /** Save order information to database**/
        let result = await update(`
            INSERT INTO ordersummary(orderDate, shiptoAddress, shiptoCity, shiptoState, shiptoPostalCode, shiptoCountry, customerId) 
                    OUTPUT inserted.orderId 
                    VALUES(@orderDate, @shiptoAddress, @shiptoCity, @shiptoState, @shiptoPostalCode, @shiptoCountry, @customerId)`
            , {
                orderDate: moment().format('YYYY-MM-DD hh:m:s'),
                shiptoAddress: customerInfo.address,
                shiptoCity: customerInfo.city,
                shiptoState: customerInfo.state,
                shiptoPostalCode: customerInfo.postalCode,
                shiptoCountry: customerInfo.country,
                customerId: customerInfo.customerId
            });

        let orderId = result.recordset[0].orderId;


        let totalAmt = 0;
        /** Insert each item into OrderedProduct table using OrderId from previous INSERT **/
        for (let productId in productList) {

            // Find the total amount for the order
            totalAmt += productList[productId].price * productList[productId].quantity;

            await query(`
                INSERT INTO orderproduct 
                OUTPUT inserted.productId
                VALUES(
                    @orderId,
                    @productId,
                    @quantity,
                    @price
                )`
                , {
                    orderId: orderId,
                    productId: productId,
                    quantity: productList[productId].quantity,
                    price: productList[productId].price
                });
        }

        /** Update total amount for order record **/
        await query(`
            UPDATE ordersummary
            SET totalAmount = ${totalAmt}
            WHERE orderId = ${orderId}
        `);

        /** Print out order summary **/
        res.write(`
            <body>
                <h1>Your Order Summary</h1>
                <table>
                    <tr>
                        <th>Product Id</th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                    </tr>
        `);

        let orderProducts = await query(
            `
            SELECT O.productId as productId, productName as name, quantity, price, (price * quantity) as subtotal 
            FROM orderproduct O JOIN product P
            ON O.productId = P.productId
            WHERE orderId = @orderId
            `,
            { orderId: orderId }
        );

        for (let i = 0; i < orderProducts.recordset.length; i++) {
            let orderProduct = orderProducts.recordset[i];
            res.write(
                `
                <tr>
                    <td>${orderProduct.productId}</td>
                    <td>${orderProduct.name}</td>
                    <td align = "center">${orderProduct.quantity}</td>
                    <td align = "right">$${orderProduct.price}</td>
                    <td align = "right">$${orderProduct.subtotal}</td>
                </tr>
                `
            );
        }

        res.write(`
        
        <tr align="right">
            <td colspan="4" >
                <b>Order Total</b>
            </td>
            <td>$${totalAmt}</td>
        </tr>
        `);

        res.write("</table></body>");

        res.write(`    
            <h1>Order completed. Will be shipped soon...</h1>
            <h1>Your order reference number is: ${orderId}</h1>
            <h1>Shipping to customer: ${customerInfo.customerId}</h1>
            <h1>Name: ${customerInfo.firstName + " " + customerInfo.lastName}</h1>
        `);
        res.write('<h2><a href="/">Return to shopping</a></h2>');

        /** Clear session/cart **/
        delete req.session.productList;
        delete req.session.cart_size;


    } catch (err) {
        let message = false;
        if (err instanceof ValidationError || err instanceof UserNotFoundError) {
            message = err.message;
        } else if (err instanceof PropertyRequiredError) {
            message = err.property == "ProductList" ? "Your cart is empty!" : "No customer id entered!";
        } else if (err instanceof sql.ConnectionError || err instanceof sql.RequestError) {
            message = "Connection Failed. Please try again!";
        } else {
            message = "Unknown Error occurs while placing your order. Please try again!";
        }
        res.write(`<h1>${message}</h1>`);
        console.dir(err);
    }
    res.end();
});

module.exports = router;
