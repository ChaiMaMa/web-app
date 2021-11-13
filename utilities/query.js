const sql = require('mssql');


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

exports.query = query;
exports.update = update;