const { query } = require('./query');

/**
 * Check if an input is numeric.
 * @param {String} input 
 */
function isNumeric(input) {
    let pattern = /^\d+$/;
    return pattern.test(input);
}


/**
 * Check if an order is valid. A valid order is one with:
 *  
 * - An existing orderId
 * - All items in the order has a quantity > 0
 * @param {Number} orderId 
 */
async function isValidOrder(orderId) {
    let itemsOrdered = await query(`
        SELECT OP.productId AS productId, OP.quantity AS quantity
        FROM ordersummary OS, orderproduct OP
        WHERE OS.orderId = OP.orderId AND OS.orderId = @orderId
    `,
        {
            orderId: orderId
        }
    );
    let valid = true;
    if (itemsOrdered.recordset.length > 0) {
        for (let item of itemsOrdered.recordset) {
            if (item.quantity < 1) {
                valid = false;
                break;
            }
        }
    } else {
        valid = false;
    }
    return valid;
}


/**
 * Validate if an order has already been processed to ship successfully.
 * @param {Number} orderId 
 */
async function shipmentProcssed(orderId) {
    let result = await query(
        `
        SELECT shipmentId, shipmentDate
        FROM shipment
        WHERE orderId = @orderId
        `
        ,
        { orderId: orderId }
    );

    if (result.recordset.length > 0) {
        console.log(result);
        return true;
    } else {
        return false;
    }
}

module.exports = {
    isNumeric,
    isValidOrder,
    shipmentProcssed
}