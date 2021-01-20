module.exports.getUserInfoByDNI = dni => {
  return new Promise(function(resolve, reject) {
    // The Promise constructor should catch any errors thrown on
    // this tick. Alternately, try/catch and reject(err) on catch.
    const { conexion } = require('../db/mysql');

    const query_str = 'SELECT * FROM becasdeportivas.datosaspirante where dni = ? ';

    const query_var = [dni];

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

module.exports.getBarrios = () => {
  return new Promise(function(resolve, reject) {
    // The Promise constructor should catch any errors thrown on
    // this tick. Alternately, try/catch and reject(err) on catch.
    const { conexion } = require('../db/mysql');

    const query_str = 'SELECT descripcion FROM becasdeportivas.barrios ';

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

module.exports.getClubes = () => {
  return new Promise(function(resolve, reject) {
    // The Promise constructor should catch any errors thrown on
    // this tick. Alternately, try/catch and reject(err) on catch.
    const { conexion } = require('../db/mysql');

    const query_str = 'SELECT * FROM becasdeportivas.clubes';

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

module.exports.getDeportesPorClub = idclub => {
  return new Promise(function(resolve, reject) {
    // The Promise constructor should catch any errors thrown on
    // this tick. Alternately, try/catch and reject(err) on catch.
    const { conexion } = require('../db/mysql');

    const query_str = `SELECT deportes.*,clubdeporte.*
    FROM becasdeportivas.clubdeporte 
    LEFT JOIN deportes ON deportes.id=clubdeporte.iddeporte
    where clubdeporte.idclub=? and (clubdeporte.cupos_total>clubdeporte.cupos_ocupados)`;

    const query_var = [idclub];

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

// continuar aca haciendo la nueva funcion por fecha
module.exports.getUserInfoByDNIandDate = (dni, date) => {
  return new Promise(function(resolve, reject) {
    // The Promise constructor should catch any errors thrown on
    // this tick. Alternately, try/catch and reject(err) on catch.
    const { conexion } = require('../db/mysql');

    const query_str =
      'SELECT * FROM viviendas.personas WHERE dni = ? AND alta > "2020/01/01" ORDER BY alta asc LIMIT 1';

    const query_var = [dni];

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

module.exports.getAllUsers = () => {
  return new Promise(function(resolve, reject) {
    // The Promise constructor should catch any errors thrown on
    // this tick. Alternately, try/catch and reject(err) on catch.
    const { conexion } = require('../db/mysql');

    const query_str = 'SELECT * FROM viviendas.personas';

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
