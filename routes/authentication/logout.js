const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    req.session.user = false;
    console.log('Logged out');
    res.redirect("/");
});

module.exports = router;
