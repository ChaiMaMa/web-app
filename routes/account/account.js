const express = require('express');
const router = express.Router();
const { updateAccount, update } = require('../../utilities/query');
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
            firstName: user.info.firstName,
            lastName: user.info.lastName,
            email: user.info.email,
            phoneNum: user.info.phonenum,
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

router.post("/update",
    [
        body("firstName").exists({ checkFalsy: true, checkNull: true }).not().isEmpty(),
        body("lastName").exists({ checkFalsy: true, checkNull: true }).not().isEmpty(),
        body("email").exists({ checkFalsy: true, checkNull: true }).not().isEmpty().isEmail(),
        body("phoneNum").exists({ checkFalsy: true, checkNull: true }).not().isEmpty().isMobilePhone(),
        body("address").exists({ checkFalsy: true, checkNull: true }).not().isEmpty(),
        body("city").exists({ checkFalsy: true, checkNull: true }).not().isEmpty(),
        body("state").exists({ checkFalsy: true, checkNull: true }).not().isEmpty(),
        body("postalCode").exists({ checkFalsy: true, checkNull: true }).not().isEmpty().isPostalCode('any'),
        body("country").exists({ checkFalsy: true, checkNull: true }).not().isEmpty(),
    ],
    async function (req, res) {
        console.log("BODY: ");
        console.log(req.body);

        // If authenticated
        if (req.session.user) {
            let user = req.session.user;
            let newInfo = {
                customerId: user.info.customerId,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phonenum: req.body.phonenum,
                address: req.body.addressNum,
                city: req.body.city,
                state: req.body.state,
                postalCode: req.body.postalCode,
                country: req.body.country
            };
            // console.log(newInfo);
            let success = await updateAccount(newInfo);

            if (success) {
                req.session.user.info = newInfo; // Update user property in current session
            }

            res.status(success ? 200 : 500).end();

        } else {
            // If not authenticated, return 401 (Check out http status code!)
            res.status(401).end();
        }

    });

module.exports = router;
