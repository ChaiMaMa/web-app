const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../../utilities/validators');
const { body, validationResult } = require('express-validator');
const { hash } = require('../../utilities/security');
const { User } = require('./user');

router.post('/',
    [
        body('username').exists({ checkNull: true, checkFalsy: true }).not().isEmpty(),
        body('password').exists({ checkNull: true, checkFalsy: true }).not().isEmpty(), // Check if username is non-empty and valid
    ],
    function (req, res) {
        (async function () {
            console.log('Checking user...');
            // If authentication fails or database connection errors, user is consider not authenticated.
            try {
                let authenticated = await isAuthenticated(req.body.username, hash(req.body.password));
                if (!authenticated) {
                    res.status(401).send('Authentication failed.');
                } else {
                    let user = new User(req.body.username, hash(req.body.password));
                    req.session.user = await user.intializeInfo();
                    res.status(200).end();
                }
            } catch (err) {
                console.log(err);
                res.status(500).send('Database connection error.');
            }

        })();
    }
);

module.exports = router;
