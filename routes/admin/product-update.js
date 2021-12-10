const express = require('express');
const router = express.Router();
const update = require('../../utilities/query').update;

router.post('/', async function (req, res) {
    res.setHeader('Content-Type', 'text/html');
    // Get product information
    let id = req.body.id;
    let name = req.body.name;
    let price = req.body.price;
    let desc = req.body.desc;
    // let img = req.body.image;
    if (!id || !name || !price) {

        res.status(400).send('Missing product information.');
        
    } else {
        
        try{
            await update(`Update product set productName = @name, productPrice = @price, productDesc = @desc where productId = @id;`,
            {   id: parseInt(id),
                name: name,
                price: parseFloat(price),
                desc: desc,
                // img: img
            });

        }catch(err){

            console.log(err);
            res.status(400).send("Database problem");

        }

    }
});

module.exports = router;
