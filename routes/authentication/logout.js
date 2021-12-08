const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    delete req.session.user;
    res.status(200).end();
});

module.exports = router;
