const express = require('express');
const router = express.Router();
const query = require('../utilities/query').query;

router.get('/', async function (req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.write(`
    <head>
        <title>YOUR NAME Grocery</title>
    </head>
    <body>
        <h1>Search for the products you want to buy:</h1>
        <form action="/listprod" method="get">
            <input type="text" name="productName" size="50">
            <input type="submit" value="Search">
            <input type="reset" value="Reset">
            <p>(Leave blank for all products)</p>
        </form>
        <h1>All Products</h1>
    `);

    // Get the product name to search for
    let name = req.query.productName;
    let condition = name == undefined || name.length == 0 ? "" : "WHERE productName LIKE '%" + name + "%'";

    let products = await query(`
        SELECT * FROM product
        ${condition}
    `, null
    );


    res.write(`
        <table>
            <tr>
                <th></th>
                <th>Product Name</th>
                <th>Price</th>
            </tr>
    `);

    for (let product of products.recordset) {
        res.write(`
            <tr>
                <td>
                    <a href="/addcart?id=${product.productId}&name=${product.productName}&price=${product.productPrice}">Add to cart</a>
                </td>
                <td>${product.productName}</td>
                <td>$${product.productPrice.toFixed(2)}</td>
            </tr>
        `);
    }

    res.write(`
        </table>
    </body>
    `);
    res.end();
});

module.exports = router;
