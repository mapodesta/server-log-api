const { LIMIT } = require('../constants/constants');

module.exports.getServerInfoByDESC = (desc, srv, off) => {
  return new Promise(function(resolve, reject) {
    // The Promise constructor should catch any errors thrown on
    // this tick. Alternately, try/catch and reject(err) on catch.
    const { conexion } = require('../db/mysql');

    let query_str;
    let newOffset = +off * LIMIT;

    if (srv === '' && desc !== '')
      query_str = `SELECT * FROM test.Servers, (SELECT COUNT(idServers) AS totalCount FROM test.Servers  WHERE  description='${desc}') 
      AS derivedTABLE where description ='${desc}' ORDER BY created_at DESC LIMIT ${newOffset},5`;
    if (desc === '' && srv !== '')
      query_str = `SELECT * FROM test.Servers, (SELECT COUNT(idServers)AS totalCount FROM test.Servers  WHERE server = '${srv}') 
      AS derivedTABLE where  server = '${srv}' ORDER BY created_at DESC LIMIT ${newOffset},5`;
    if (srv !== '' && desc !== '')
      query_str = `SELECT * FROM test.Servers, (SELECT COUNT(idServers) AS totalCount FROM test.Servers  WHERE server = '${srv}' and description='${desc}') 
      AS derivedTABLE where description ='${desc}' AND server = '${srv}' ORDER BY created_at DESC LIMIT ${newOffset},5`;
    if (srv === '' && desc === '')
      query_str = `SELECT * FROM test.Servers, (SELECT COUNT(idServers)AS totalCount FROM test.Servers  ) as derivedTable ORDER BY created_at DESC LIMIT ${newOffset},5`;

    const query_var = [desc, srv, off];

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
