const sql = require('mssql');


// Query the database and return the result
async function query(query) {
    let results = null;
    try {
        let pool = await sql.connect(dbConfig);
        results = await pool.request().query(query)
    } catch (err) {
        console.log(err);
    }
    return results;
}

exports.query = query;