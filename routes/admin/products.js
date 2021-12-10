const express = require('express');
const router = express.Router();
const query = require('../../utilities/query').query;

router.get('/', async function (req, res, next) {
    // Check if the user is an admin
    if (!req.session.user || !req.session.user.info.isAdmin) {
        res.status(401).end();
        return;
    }

    var productInfo = '';

    res.setHeader('Content-Type', 'text/html');

    // Get the product name to search for
    // let name = req.query.productName;
    // let condition = (name && name.length > 0) ? "WHERE LOWER(productName) LIKE '%" + name.toLowerCase() + "%'" : "";

    let products = await query(`
        SELECT productId, productName, productDesc, productPrice, productImage FROM product
    `, null
    );

    for (let i = 0; i < products.recordset.length; i++) {

        let product = products.recordset[i];

        productInfo += `
            <tr id = ${product.productId} contenteditable="true" class = "contenteditable">
                <td contenteditable="false">${product.productId}</td>
                <td class ="productName">${product.productName}</td>
                <td class ="productDesc">${product.productDesc}</td>
                <td class ="productPrice">${product.productPrice}</td>
                <td class ="productImage"><img src="/displayImage?id=${product.productId}" alt= "Product Image" data-reflow-preview-type="image" /></td>
            </tr>
        `;
    }

    res.render(
        'layouts/admin_product',
        {
            products: productInfo,
            layout: false,
        }
    );
});

module.exports = router;
