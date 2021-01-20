module.exports.getAll = () => {
    return new Promise(function (resolve, reject) {
        // The Promise constructor should catch any errors thrown on
        // this tick. Alternately, try/catch and reject(err) on catch.
        const { conexion } = require('../db/mysql');

        var query_str = `SELECT * FROM acceso `;

        var query_var = [];

        conexion.query(query_str, query_var, function (err, rows, fields) {
            // Call reject on error states,
            // call resolve with results
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}
