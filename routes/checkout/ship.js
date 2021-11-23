const express = require('express');
const router = express.Router();
const { TransactionError } = require('mssql');
const { NotEnoughInventory, ProductNotFound } = require('../../utilities/errors');
const { isValidOrder } = require('../../utilities/validators');
const { updateShipment, query } = require('../../utilities/query');

router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'text/html');

    // TODO: Get order id
    let orderId = req.query.orderId;

    if (orderId) {
        (async function () {
            // TODO: Check if valid order id
            let isValid = await isValidOrder(orderId);

            if (isValid) {
                try {

                    // TODO: Retrieve all items in order with given id
                    let orderedItems = await query(`
                        SELECT OS.orderId AS orderId, productId, quantity, orderDate
                        FROM ordersummary AS OS, orderproduct AS OP
                        WHERE OS.orderId = OP.orderId AND OS.orderId = @orderId
                    `,
                        {
                            orderId = orderId
                        }
                    );

                    // Run transaction for each item
                    for (item of orderedItems.recordset) {
                        // TODO: Start a transaction
                        // Might throw an error
                        await updateShipment(item);
                    }
                } catch (err) {
                    if (err instanceof TransactionError) {
                        res.status(500);
                    } else if (err instanceof NotEnoughInventory) {
                        res.status(500).write(`
                        <h1>${err.message}</h1>
                        `);
                    } else if (err instanceof ProductNotFound) {
                        res.status(400).write(`
                        <h1>${err.message}</h1>
                        `);
                    } else {
                        res.status(500).write(`
                        <h1>Unexpected error occurs</h1>
                        `);
                    }
                    console.dir(err);
                    res.end();
                }
            } else {
                res.status(404).end();
            }
        })();
    } else {
        res.status(404).end();
    }
});



module.exports = router;
