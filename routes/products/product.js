const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    (async function() {
        res.write("<title>Chai MaMa</title>");
        try {
            let pool = await sql.connect(dbConfig);

	// Get product name to search for
    let id = req.query.id;
    let name = req.query.name;
    let price = req.query.price;
	// TODO: Retrieve and display info for the product
    res.write(`<h1>${name}</h1>`);
	// TODO: If there is a productImageURL, display using IMG tag
    
    res.write(`<div class="column">
    <div class="row">
        <img src="images/1_a.jpg" width="300" height="300">
    </div>
    <div class="row">
        <img src="images/1.jpg" width="300" height="300">
    </div>
    </div>`)
	// TODO: Retrieve any image stored directly in database. Note: Call displayImage.jsp with product id as parameter.

	// TODO: Add links to Add to Cart and Continue Shopping

            res.end()
        } catch(err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();
});

module.exports = router;
