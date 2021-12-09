const express = require('express');
const router = express.Router();
const query = require('../../utilities/query').query;

router.get('/', async function (req, res, next) {
    var warehouseInfo = '';

    res.setHeader('Content-Type', 'text/html');

    // Get the product name to search for
    // let name = req.query.productName;
    // let condition = (name && name.length > 0) ? "WHERE LOWER(productName) LIKE '%" + name.toLowerCase() + "%'" : "";

    let warehouses= await query(`
        SELECT w.warehouseId, warehouseName, p.productId, quantity FROM warehouse w join productinventory p on w.warehouseId = p.warehouseId
    `, null
    );

    for (let i = 0; i < warehouses.recordset.length; i++) {

        let warehouse = warehouses.recordset[i];
       
        warehouseInfo += `
            <tr>
                <td>${warehouse.productId}</td>
                <td>${warehouse.quantity}</td>
                <td>${warehouse.warehouseId}</td>
                <td>${warehouse.warehouseName}</td>
                
            </tr>
        `;
    }

    res.render(
        'layouts/admin_inventory',
        {
            warehouses: warehouseInfo
        }
    );
});

module.exports = router;