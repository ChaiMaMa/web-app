const express = require('express');
const router = express.Router();
const path = require('path');


router.get('/', function (req, res) {

    let productList = req.session.productList;
    if (productList && req.session.productCount > 0) {
        let products = '';
        let subTotal = 0;
        for (let productId in productList) {
            let product = productList[productId];

            // Create a product element for displaying
            products += `
            <div id='product_${product.id}'>
                <div class="ref-product">
                <div class="ref-product-col">
                    <div class="ref-product-wrapper"><img class="ref-product-photo"
                            src="https://cdn.bootstrapstudio.io/products/product-9_sm.jpg"
                            alt="${product.name}" />
                        <div class="ref-product-data">
                            <div class="ref-product-info">
                                <div id='product_name_${product.id}' class="ref-product-name">${product.name}</div>
                                <!--  <div class="ref-product-category">Tea</div> -->
                                <div id='product_id_${product.id}' class="ref-product-id" hidden>${product.id}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ref-price-col">
                    <div id='price_${product.id}' class="ref-product-price">$${product.price}</div>
                </div>
                <div class="ref-quantity-col">
                    <div class="ref-product-quantity">
                        <div class="ref-quantity-widget">
                            <div class="ref-decrease" onclick='updateQuantity(${product.id}, false, false);'>-</div>
                            <input id='quantity_${product.id}' type="text" value=${product.quantity} />
                            <div class="ref-increase" onclick='updateQuantity(${product.id}, true, false);'>+</div>
                        </div>
                        <div class="ref-product-remove" onclick='updateQuantity(${product.id}, false, true);'>Remove</div>
                    </div>
                </div>
                <div class="ref-total-col">
                    <div class="ref-product-total">
                        <div id='total_${product.id}' class="ref-product-total-sum">$${(Number(product.quantity) * Number(product.price)).toFixed(2)}</div>
                    </div>
                </div>
                </div>
            </div>
            `;

            // Computing the subtotal
            subTotal += product.quantity * product.price;

        }

        res.render('layouts/showcart', {
            products: products,
            subTotal: subTotal.toFixed(2)
        });
    } else {
        res.sendFile(path.join(__dirname, '../../public/layouts/empty_cart.html'));
    }
});

module.exports = router;
