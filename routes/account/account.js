const express = require('express');
const router = express.Router();
const path = require('path');
const { body } = require('express-validator');

// // Mock user used for testing
// let mockUser = {
//     customerId: 1,
//     firstName: "John",
//     lastName: "Smith",
//     email: "jsmith@gmail.com",
//     phoneNum: "2505551234",
//     address: "3174 University Way",
//     city: "Kelowna",
//     state: "BC",
//     postalCode: "V1V1V8",
//     country: "Canada"
// }

router.get('/', function (req, res, next) {

    // If the current session has a user property, we have an authenticated user.
    let authenticated = req.session.user != undefined;

    if (authenticated) {
        // Define content type in http response message
        res.setHeader('Content-Type', 'text/html');

        let user = req.session.user;

        console.log(user);

        // Render the template
        res.render('layouts/account', {
            title: `Your account - ${user.info.firstName} ${user.info.lastName}`,
            auth_ref: "#",
            auth_text: "Account",
            firstName: user.info.firstName,
            lastName: user.info.lastName,
            email: user.info.email,
            phoneNum: user.info.phoneNum,
            address: user.info.addressNum,
            city: user.info.city,
            state: user.info.state,
            postalCode: user.info.postalCode,
            country: user.info.country,
            layout: false // This will not set a default layout (e.g. avoiding duplicate head/body tags)
        });
    } else { // Not authenticated? Redirect to login
        res.redirect("/login");
    }
});

module.exports = router;
