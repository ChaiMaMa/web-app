const express = require('express');
const router = express.Router();
const query = require('../../utilities/query').query;

router.get('/', async function (req, res, next) {
    var productInfo = '';

    res.setHeader('Content-Type', 'text/html');

    // Get the product name to search for
    // let name = req.query.productName;
    // let condition = (name && name.length > 0) ? "WHERE LOWER(productName) LIKE '%" + name.toLowerCase() + "%'" : "";

    let products= await query(`
        SELECT productId, productName, productDesc, productPrice, productImage FROM product
    `, null
    );

    for (let i = 0; i < products.recordset.length; i++) {

        let product = products.recordset[i];
       
        productInfo += `
            <tr>
                <td>${product.productId}</td>
                <td>${product.productName}</td>
                <td>${product.productDesc}</td>
                <td>${product.productPrice}</td>
                <td><img src="/displayImage?id=${product.productId}" alt= "Product Image" data-reflow-preview-type="image" /></td>
            </tr>
        `;
    }

    res.render(
        'layouts/admin_product',
        {
            products: productInfo
        }
    );
});

module.exports = router;
