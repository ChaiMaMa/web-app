// const { query } = require('express');
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const query = require('../../utilities/query').query;

router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    (async function () {
        res.write("<title>Chai MaMa</title>");
        try {
            res.write('<h1 align="center"><font face="cursive" color="#3399FF"><a href="/">Chai MaMa</a></font></h1><hr>');
            let pool = await sql.connect(dbConfig);

            // Get product name to search for
            let id = req.query.id;
            let name = req.query.name;
            let price = req.query.price;

            // TODO: Retrieve and display info for the product
            res.write(`<h1>${name}</h1>`);

            // TODO: If there is a productImageURL, display using IMG tag
            // TODO: Retrieve any image stored directly in database. Note: Call displayImage.jsp with product id as parameter.

            let result = await query(
                `select productImageURL, productImage from Product where productId = @productId`,
                {
                    productId: id
                }
            );

            let imageLink = result.recordset[0].productImageURL;
            let binaryImage = result.recordset[0].productImage;

            if (imageLink) {
                res.write(`
                    <img src= "${imageLink}" width="300" height="300">
                    `
                );
            }

            if (binaryImage) {
                res.write(`
                    <img src= "/displayImage?id=${id}" width="300" height="300"></img>
                    `
                );
            }

            // res.write(`
            //         <img src= "${imageLink}" width="300" height="300">`);

            res.write(
                `<table>
                    <tr>
                        <th>Id</th>
                        <td>${id}</td>
                    </tr>
                    <tr>
                        <th>Price</th>
                        <td>$${price}</td>
                    </tr>
                </table>`
            );

            // TODO: Add links to Add to Cart and Continue Shopping

            res.write(
                `<h2><a href="/addcart?id=${id}&name=${name}&price=${price}">Add to cart</a></h2>
                <h2><a href="/listprod">Continue Shopping</a></h2></body>`
            );

            res.end()
        } catch (err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();
});

module.exports = router;
