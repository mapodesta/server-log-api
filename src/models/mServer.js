module.exports.getServerInfoByDESC = (desc, srv) => {
  return new Promise(function(resolve, reject) {
    // The Promise constructor should catch any errors thrown on
    // this tick. Alternately, try/catch and reject(err) on catch.
    const { conexion } = require('../db/mysql');

    let query_str;

    if (srv === '' && desc !== '')
      query_str = 'SELECT * FROM test.Servers where description = ?  ORDER BY created_at DESC';
    if (desc === '' && srv !== '')
      query_str = `SELECT * FROM test.Servers where server ='${srv}'  ORDER BY created_at DESC`;
    if (srv !== '' && desc !== '')
      query_str =
        'SELECT * FROM test.Servers where description = ? AND server = ? ORDER BY created_at DESC';

    const query_var = [desc, srv];

    conexion.query(query_str, query_var, function(err, rows, fields) {
      // Call reject on error states,
      // call resolve with results
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};

module.exports.getErrores = () => {
  return new Promise(function(resolve, reject) {
    // The Promise constructor should catch any errors thrown on
    // this tick. Alternately, try/catch and reject(err) on catch.
    const { conexion } = require('../db/mysql');

    const query_str = 'SELECT * FROM test.Servers ';

    const query_var = [];

    conexion.query(query_str, query_var, function(err, rows, fields) {
      // Call reject on error states,
      // call resolve with results
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};

module.exports.getServers = () => {
  return new Promise(function(resolve, reject) {
    // The Promise constructor should catch any errors thrown on
    // this tick. Alternately, try/catch and reject(err) on catch.
    const { conexion } = require('../db/mysql');

    const query_str = 'SELECT DISTINCT server FROM test.Servers ';

    const query_var = [];

    conexion.query(query_str, query_var, function(err, rows, fields) {
      // Call reject on error states,
      // call resolve with results
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};

module.exports.getTopServers = () => {
  return new Promise(function(resolve, reject) {
    // The Promise constructor should catch any errors thrown on
    // this tick. Alternately, try/catch and reject(err) on catch.
    const { conexion } = require('../db/mysql');

    const query_str = ` SELECT COUNT(Servers.server) as Eventos,Servers.server
    FROM test.Servers 
    GROUP BY Servers.server 
    ORDER BY Eventos DESC
    LIMIT 3  `;

    const query_var = [];

    conexion.query(query_str, query_var, function(err, rows, fields) {
      // Call reject on error states,
      // call resolve with results
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};
