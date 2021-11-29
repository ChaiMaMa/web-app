const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'text/html');

    let options = {};
    if (req.session.user) {
        let user = req.session.user;
        options.id = user.info.id;
        options.email = user.info.email;
        options.phone = user.info.phonenum;
    }
    res.render('layouts/checkout', options);
});

module.exports = router;
