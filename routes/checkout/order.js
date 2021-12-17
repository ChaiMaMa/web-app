const express = require('express');
const router = express.Router();
const moment = require('moment');
const sql = require('mssql');
const path = require('path');
const { TransactionError } = require('mssql');
const { NotEnoughInventory, ProductNotFound, OrderEmptyError, ValidationError, PropertyRequiredError, UserNotFoundError } = require('../../utilities/errors');
const { isNumeric } = require('../../utilities/validators');
const { updateShipment, query, update } = require('../../utilities/query');
const { hash } = require('../../utilities/security');
const { redirect } = require('express/lib/response');


router.post('/', [
    setupOrder,
    setupShipment
]);

async function setupOrder(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    try {
        /** 
         * Product list is an object with keys being the product id and the value being the product object.
         * Each entry (product object) in the productList is an object with key values: id, name, quantity, price 
         **/
        let productList = req.session.productList;
        let customerId = req.body.customerId;
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

        /** Clear the shopping cart **/
        delete req.session.productList;
        delete req.session.productCount;

        // TODO: Set an attribute to save the pendig orderId
        req.session.pendingOrder = {
            orderId: orderId,
            hashedId: null
        };

        // Move to the next handler for shipment
        next();

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
        console.log("Error: " + message);
        console.dir(err);
        res.status(500).send();
    }
}

async function setupShipment(req, res) {
    res.setHeader('Content-Type', 'text/html');

    // Get order id from session
    // Certainly orderId is valid as handle is passed to this handler.
    let orderId = req.session.pendingOrder.orderId;

    // Create a hashed string for the confirmation
    let hashedId = hash(orderId + moment().format("YYYY-MM-DD"));

    // Save it to session
    req.session.pendingOrder.hashedId = hashedId;


    (async function () {
        try {
            let orderedItems = await query(
                `
                SELECT OS.orderId AS orderId, productId, quantity, orderDate
                FROM ordersummary AS OS, orderproduct AS OP
                WHERE OS.orderId = OP.orderId AND OS.orderId = @orderId
                `,
                { orderId: orderId }
            );

            // Run transaction for each item
            // Might throw an error if a rollback is triggered or any sql-related errors occur
            if (orderedItems.recordset.length > 0) {
                await updateShipment(orderedItems.recordset);
            } else {
                throw new OrderEmptyError(orderId);
            }

            // If successful, redirect to confirmation page
            res.redirect("/confirmation/success/" + hashedId);
        } catch (err) {
            if (err instanceof TransactionError) {
                res.status(500);
            } else if (err instanceof NotEnoughInventory) {
                res.status(500);
            } else if (err instanceof ProductNotFound || err instanceof OrderEmptyError) {
                res.status(400);
            } else {
                res.status(500);
            }
            console.dir(err);
            res.redirect("/confirmation/pending/" + hashedId);
        }
    })();
}

module.exports = router;
