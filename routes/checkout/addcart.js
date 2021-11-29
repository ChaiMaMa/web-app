const express = require('express');
const router = express.Router();

router.post('/', function (req, res) {
    // If the product list isn't set in the session,
    // create a new list.
    let productList = false;
    if (!req.session.productList) {
        productList = {};
        req.session.productList = productList;
    } else {
        productList = req.session.productList;
    }
    // Add the product to the list.
    // Get product information
    let id = req.body.id;
    let name = req.body.name;
    let price = req.body.price;
    let quantity = req.body.quantity;
    if (!id || !name || !price || !quantity) {
        res.status(400).send('Missing product information.');
    } else {
        // Update quantity if product already exists in the list.
        if (productList[id]) {
            productList[id].quantity += Number(quantity);
        } else {
            productList[id] = {
                "id": id,
                "name": name,
                "price": price,
                "quantity": Number(quantity)
            };

        }
        console.log(productList[id]);
        req.session.cartIsEmpty = false;
        res.status(200).send(productList[id]);
    }
});

module.exports = router;
