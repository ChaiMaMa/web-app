const e = require('express');
const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    // If the product list isn't set in the session,
    // create a new list.
    let productList = false;
    if (!req.session.productList) {
        productList = {};
    } else {
        productList = req.session.productList;
    }


    // Check if updates are requested
    if (req.query.update) {
        let id = req.query.id;
        let quantity = req.query.quantity;

        if (id && quantity && productList[id]) {
            let num = Number(quantity);
            if (num > 0) {
                productList[id].quantity = num;
            } else {
                delete productList[id];
                req.session.cart_size--;
            }

        } else {
            res.redirect("/listprod");
            return;
        }
    } else {
        // Add new product selected
        // Get product information
        let id = false;
        let name = false;
        let price = false;
        if (req.query.id && req.query.name && req.query.price) {
            id = req.query.id;
            name = req.query.name;
            price = req.query.price;
        } else {
            res.redirect("/listprod");
            return;
        }

        // Update quantity if add same item to order again
        if (productList[id]) {
            productList[id].quantity = productList[id].quantity + 1;
        } else {
            productList[id] = {
                "id": id,
                "name": name,
                "price": price,
                "quantity": 1
            };
        }
        req.session.cart_size++;
    }



    req.session.productList = productList;
    res.redirect("/showcart");
});

module.exports = router;
