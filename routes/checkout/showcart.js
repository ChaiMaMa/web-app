const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    let productList = false;
    res.setHeader('Content-Type', 'text/html');
    res.write("<title>Your Shopping Cart</title>");
    if (req.session.productList) {
        productList = req.session.productList;
        res.write("<h1>Your Shopping Cart</h1>");
        res.write(`
        <head> 
            <style>
                input[type='number']{
                    width: 50px;s
                } 

                button {
                    margin-right: 10px;
                    margin-left: 10px;
                }
            </style>
        </head>
        <body>
        <script>
            function updateQuantity(id) {
                window.location = '/addcart?update=1&id=' + id + '&quantity=' + document.getElementById(id + "_quantity").value;
            }
        </script>
        <table>
            <tr>
                <th>Product Id</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
            </tr>
        `);
        let total = 0;
        for (let productId in productList) {
            let product = productList[productId];

            res.write(`
            <tr id = "${product.id}_row">
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td align="center">
                <input type="number" name="quantity" id ="${product.id}_quantity" value=${product.quantity} min="0"></input>
                </td>
                <td align="right">${Number(product.price).toFixed(2)}</td>
                <td align="right">${(Number(product.quantity) * Number(product.price)).toFixed(2)}</td>
                <td><button onclick="updateQuantity(${product.id})" size = "40">Update Quantity</button></td>
            </tr>
            `);
            total = total + product.quantity * product.price;
        }
        res.write("<tr><td colspan=\"4\" align=\"right\"><b>Order Total</b></td><td align=\"right\" id=\"total\">$" + total.toFixed(2) + "</td></tr></table>");

        // If there is any items in the cart, show the checkout button
        if (req.session.cart_size > 0) {
            res.write("<h2><a href=\"checkout\">Check Out</a></h2>");
        }
    } else {
        res.write("<h1>Your shopping cart is empty!</h1>");
    }
    res.write('<h2><a href="/listprod">Continue Shopping</a></h2></body>');

    res.end();
});

module.exports = router;
