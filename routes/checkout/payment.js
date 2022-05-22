
const router = require('express').Router();
const path = require('path');
// This is created with a sample API key
// Do not use in production
// TODO: Replace with your own API key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


// Change this field for default currency
const defaultCurrency = 'eur';


/**
 * Calculate the total amount to be charged (shipment + tax excluded)
 * @param {object} cart The product list from current session
 * @returns {number} The total price of the cart
 */
let calculateOrderTotal = (cart) => {
    let total = 0;

    for (let id in cart) {
        total += cart[id].quantity * cart[id].price
    }

    return total;
};


router.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "..", "public", "layouts", "payment.html"))
});



router.post("/", async function (req, res) {
    // Get the product list from the session
    let productList = req.session.productList;

    // Get the customer id from the request body
    let customerId = req.body.customerId;

    // Calculate the total price
    let totalPrice = calculateOrderTotal(productList);

    // Create a Stripe charge
    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalPrice,
        currency: defaultCurrency,
        automatic_payment_methods: {
            enabled: true
        }
    });

    console.log("Secret: " + paymentIntent.client_secret)

    // Send back client secret
    res.send({
        clientSecret: paymentIntent.client_secret
    })

});


module.exports = router;

