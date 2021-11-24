const { query } = require('./query');

function isNumeric(input) {
    let pattern = /^\d+$/;
    return pattern.test(input);
}

async function isAuthenticated(username, password) {
    let result = await query(`
        SELECT COUNT(*) AS count
        FROM customer
        WHERE userid = @userid AND password = @password
    `,
        {
            userid: username,
            password: password
        }
    );

    if (result.recordset[0].count > 1) {
        console.log('Database has duplicate credentials!');
    }
    console.log(result);
    return result.recordset[0].count == 1;
}

module.exports = {
    isNumeric,
    isAuthenticated
};