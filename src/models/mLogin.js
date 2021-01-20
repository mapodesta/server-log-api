module.exports.getUserByDNIandPassword = (dni, hashedPassword) => {
    return new Promise(function (resolve, reject) {
        // The Promise constructor should catch any errors thrown on
        // this tick. Alternately, try/catch and reject(err) on catch.
        const { Intranetconnection } = require('../db/mysql');

        const query_str = "SELECT * FROM usuario WHERE nrodni= ? AND password = ?";

        const query_var = [dni, hashedPassword];

        Intranetconnection.query(query_str, query_var, function (err, rows, fields) {
            // Call reject on error states,
            // call resolve with results
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}