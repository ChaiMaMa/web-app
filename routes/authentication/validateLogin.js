const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { isAuthenticated } = require('../../utilities/validators')

router.post('/', function (req, res) {
    // Have to preserve async context since we make an async call
    // to the database in the validateLogin function.
    (async () => {
        let authenticated = await validateLogin(req);
        if (authenticated) {
            res.redirect("/");
        } else {
            res.redirect("/login");
        }
    })();
});

async function validateLogin(req) {
    if (!req.body || !req.body.username || !req.body.password) {
        return false;
    }

    let username = req.body.username;
    let password = req.body.password;
    let authenticated = false;
    try {
        authenticated = await isAuthenticated(username, password);
    } catch (err) {
        console.dir(err);
    }

    return authenticated;
}

module.exports = router;
