const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {

    // Invalidate the session ID -> destroy the session
    // This appears to be equavalent to setting req.session.cookie.maxAge to 0
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        }
    });
    res.redirect('/login', 301);
});

module.exports = router;
