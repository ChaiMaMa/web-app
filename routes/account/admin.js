const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', function (req, res, next) {


    // TODO: Include files auth.jsp and jdbc.jsp



    res.setHeader('Content-Type', 'text/html');

    (async function () {
        try {

            // TODO: Write SQL query that prints out total order amount by day
        } catch (err) {
            console.dir(err);
            res.write(err + "");
            res.end();
        }
    })();

    res.render(path.join(__dirname, '../../public/layouts/admin_dashboard'), {

    });
});

module.exports = router;