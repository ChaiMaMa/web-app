const sql = require('mssql');


/**
 * 
 * @param {String} query sql query (e.g. SELECT * FROM table)
 * @param {Object} params parameters to be passed to the query
 * @returns {Promise<sql.IResult<any>} The result of the query
 */
async function query(query, params) {
    let results = null;
    try {
        let pool = await sql.connect(dbConfig);
        let request = pool.request();

        if (params) {
            for (let key in params) {
                request.input(key, params[key]);
            }
        }
        results = await request.query(query)
    } catch (err) {
        console.log(err);
    }
    return results;
}

exports.query = query;