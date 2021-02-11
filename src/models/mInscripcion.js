module.exports.getUserInfoByDNI = dni => {
  return new Promise(function(resolve, reject) {
    // The Promise constructor should catch any errors thrown on
    // this tick. Alternately, try/catch and reject(err) on catch.
    const { conexion } = require('../db/mysql');

    const query_str =
      'SELECT * FROM becasdeportivas.datosaspirante where dni = ? ORDER BY anio DESC';

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

module.exports.getTutorInfoByIdaspirante = idaspirante => {
  return new Promise(function(resolve, reject) {
    // The Promise constructor should catch any errors thrown on
    // this tick. Alternately, try/catch and reject(err) on catch.
    const { conexion } = require('../db/mysql');

    const query_str = 'SELECT * FROM becasdeportivas.datospadrestutor where idAspirante = ? ';

    const query_var = [idaspirante];

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
    where clubdeporte.idclub=? `;

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

module.exports.getCategoriasPorDeporte = data => {
  console.log('data modelo');
  console.log(data);
  return new Promise(function(resolve, reject) {
    // The Promise constructor should catch any errors thrown on
    // this tick. Alternately, try/catch and reject(err) on catch.
    const { conexion } = require('../db/mysql');

    const query_str = `SELECT deportes.*,clubdeporte.*,clubdeportecategoria.*,concat(clubdeportecategoria.categoria,'/',clubdeportecategoria.categoriahasta) AS categoriatxt
    FROM becasdeportivas.clubdeportecategoria 
    INNER JOIN clubdeporte ON clubdeporte.id=clubdeportecategoria.idclubdeporte
    INNER JOIN deportes ON  deportes.id=clubdeporte.iddeporte
    INNER JOIN clubes ON clubes.idclub=clubdeporte.idclub
    where clubes.idclub=? and clubdeporte.iddeporte=? and(clubdeportecategoria.categoria <= ${data.fechanac} and clubdeportecategoria.categoriahasta >= ${data.fechanac})
    and (clubdeportecategoria.sexo=? or clubdeportecategoria.sexo='A')`;

    const query_var = [parseInt(data.club), parseInt(data.deporte), data.sexoDB];

    // console.log(query_str);

    conexion.query(query_str, query_var, function(err, rows, fields) {
      // Call reject on error states,
      // call resolve with results
      if (err) {
        return reject(err);
      }
      console.log('RESPUESTA');
      console.log(rows);
      resolve(rows);
    });
  });
};

module.exports.getUserInfoByDNIandDate = dni => {
  return new Promise(function(resolve, reject) {
    // The Promise constructor should catch any errors thrown on
    // this tick. Alternately, try/catch and reject(err) on catch.
    const { conexion } = require('../db/mysql');

    const query_str =
      'SELECT * FROM becasdeportivas.datosaspirante WHERE dni = ? AND anio = 2021 ORDER BY anio asc LIMIT 1';

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

// module.exports.getAllUsers = () => {
//   return new Promise(function(resolve, reject) {
//     // The Promise constructor should catch any errors thrown on
//     // this tick. Alternately, try/catch and reject(err) on catch.
//     const { conexion } = require('../db/mysql');

//     const query_str = 'SELECT * FROM viviendas.personas';

//     const query_var = [];

//     conexion.query(query_str, query_var, function(err, rows, fields) {
//       // Call reject on error states,
//       // call resolve with results
//       if (err) {
//         return reject(err);
//       }
//       resolve(rows);
//     });
//   });
// };
