const sql = require('mssql');
const { ProductNotFound, NotEnoughInventory } = require('./errors');

/**
 * Execute an SQL query and return the result (as a Promise). All exceptions must be caught by the caller.
 * @param {String} query sql query (e.g. SELECT * FROM table)
 * @param {Object} params parameters to be passed to the query
 * @returns {Promise<sql.IResult<any>} The result of the query
 */
async function query(query, params) {
    let results = null;
    let pool = await sql.connect(dbConfig);
    let request = pool.request();
    if (params) {
        for (let key in params) {
            request.input(key, params[key]);
        }
    }
    results = await request.query(query)
    return results;
}

/**
 * Execute an SQL update query and return the result (as a Promise). All exceptions must be caught by the caller.
 * @param {String} query sql query (e.g. UPDATE table SET column = @value WHERE id = @id)
 * @param {Object} params parameters to be passed to the query
 * @returns {Promise<sql.IResult<any>} The result of the query
 */
async function update(queryStr, params) {
    return await query(queryStr, params);
}


/**
 * Update the database with shipments of ordered product.
 * @param {any} orderedItem The object representing the ordered item.
 */
async function updateShipment(orderedItem) {
    let transaction = new sql.Transaction(); // Use global connection pool
    await transaction.begin();

    // TODO: For each item verify sufficient quantity available in warehouse 1.
    let warehouseId = 1;
    let itemInventory = await transaction.request().input(
        "warehouseId",
        sql.Int,
        warehouseId
    ).input(
        "productId",
        sql.Int,
        orderedItem.productId
    ).input(
        "orderedQuantity",
        sql.Int,
        orderedItem.quantity
    ).output(
        "quantity", sql.Int
    ).query(
        `
        UPDATE productinventory
        SET quantity = quantity - @orderedQuantity
        WHERE warehouseId = @warehouseId AND productId = @productId
        `
    );

    // TODO: If any item does not have sufficient inventory, cancel transaction and rollback. Otherwise, update inventory for each item.
    let result = itemInventory.recordset[0];
    if (!result) {
        await transaction.rollback();
        throw new ProductNotFound(orderedItem.productId);
    } else if (result.quantity < 0) {
        await transaction.rollback();
        throw new NotEnoughInventory(orderedItem.productId, result.quantity);
    } else {
        // TODO: Create a new shipment record.
        let record = `${orderedItem.productId}, ${orderedItem.orderDate}, NULL, ${warehouseId}`;
        await transaction.request().input(
            "record",
            sql.String,
            record
        ).query(
            `
            INSERT INTO shipment
            VALUES (@record)
        `
        );

        await transaction.commit();
    }
}

module.exports = {
    query,
    update,
    updateShipment
};