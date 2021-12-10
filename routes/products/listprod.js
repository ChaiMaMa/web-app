const express = require('express');
const router = express.Router();
const query = require('../../utilities/query').query;

router.get('/', async function (req, res, next) {
    var productInfo = '';

    res.setHeader('Content-Type', 'text/html');

    // Get the product name to search for
    let name = req.query.productName;
    let condition = (name && name.length > 0) ? "WHERE LOWER(productName) LIKE '%" + name.toLowerCase() + "%'" : "";

    let products = await query(`
        SELECT * FROM product JOIN category ON product.categoryId = category.categoryId
        ${condition}
    `, null
    );

    for (let product of products.recordset) {
        let imageLink = product.productImageURL;
        let binaryImage = product.productImage;
        let src = '/images/placeholder.jpeg';
        if (imageLink) {
            src = imageLink;
        }
        else if (binaryImage) {
            src = `/displayImage?id=${product.productId}`;
        }

        productInfo += `
        <a class="ref-product" href="/product?id=${product.productId}&name=${product.productName}&price=${product.productPrice}&desc=${product.productDesc}&cat=${product.categoryName}">
            <img class="ref-image" src=${src} loading="lazy" />
            <div class="ref-product-data">
                <div class="ref-product-info">
                    <h5 class="ref-name">${product.productName}</h5>
                </div>
                <p class="ref-price">$${Number(product.productPrice).toFixed(2)}</p>
            </div>
        </a>
        `;
    }

    res.render(
        'layouts/listprod',
        {
            products: productInfo
        }
    );
});

module.exports = router;
