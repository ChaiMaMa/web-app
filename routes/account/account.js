const express = require('express');
const router = express.Router();
const path = require('path');

// Mock user
let mockUser = {
    customerId: 1,
    firstName: "John",
    lastName: "Smith",
    email: "jsmith@gmail.com",
    phoneNum: "2505551234",
    address: "3174 University Way",
    city: "Kelowna",
    state: "BC",
    postalCode: "V1V1V8",
    country: "Canada"
}


router.get('/', function (req, res, next) {

    let authenticated = mockUser != undefined;
    res.setHeader('Content-Type', 'text/html');
    res.render('layouts/account', {
        title: `Your account - ${mockUser.firstName} ${mockUser.lastName}`,
        auth_ref: authenticated ? "/account" : "/login",
        auth_text: authenticated ? "Account" : "Login",
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
        phoneNum: mockUser.phoneNum,
        address: mockUser.address,
        city: mockUser.city,
        state: mockUser.state,
        postalCode: mockUser.postalCode,
        country: mockUser.country,
        layout: false
    });
});

module.exports = router;
