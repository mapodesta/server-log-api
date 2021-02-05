module.exports.postNuevoInscripto = data => {
  console.log('DATA MODELO');
  data.estado = 'Alta';
  data.anio = 2021;
  console.log(data);
  console.log(data.startBirthDateAspirante.substring(0, 10));
  return new Promise(function(resolve, reject) {
    const { conexion } = require('../db/mysql');

    const query_str =
      'INSERT INTO becasdeportivas.datosaspirante (NombreApellido, fechaNac, DNI, Barrio, Direccion, Telefono, email, Colegio, estado, anio, sexo,fechaInsc) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,NOW())';

    const query_var = [
      data.nombreCompletoAspirante,
      data.startBirthDateAspirante.substring(0, 10),
      data.dniAspirante,
      data.barrioAspirante.label,
      data.domicilioAspirante,
      data.telefonoAspirante,
      data.emailAspirante,
      data.colegio,
      data.estado,
      data.anio,
      data.sexoAspiranteDB
    ];

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

module.exports.postNuevoInscriptoTutor = (data, idaspirante) => {
  console.log('DATA MODELO');
  data.anio = 2021;
  console.log(data.startBirthDateAspirante.substring(0, 10));
  return new Promise(function(resolve, reject) {
    const { conexion } = require('../db/mysql');

    const query_str =
      'INSERT INTO becasdeportivas.datospadrestutor (NombreApellido, fechaNac, DNI, Barrio, Direccion, telTutor, email, idAspirante, anio) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ';

    const query_var = [
      data.nombreCompletoTutor,
      data.startBirthDateTutor.substring(0, 10),
      data.dniTutor,
      data.barrioTutor.label,
      data.domicilioTutor,
      data.telefonoTutor,
      data.emailTutor,
      idaspirante,
      data.anio
    ];

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

module.exports.updateCupo = id => {
  console.log('DATA MODELO CUPO', id);
  return new Promise(function(resolve, reject) {
    const { conexion } = require('../db/mysql');

    const query_str =
      'UPDATE becasdeportivas.clubdeportecategoria SET cupos_ocupados=cupos_ocupados+1 where id=?';

    const query_var = [id];

    conexion.query(query_str, query_var, function(err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};

module.exports.postNuevaBeca = (
  idclub,
  iddeporte,
  anio,
  categoriatxt,
  idcategoria,
  idaspirante
) => {
  console.log('DATA MODELO INSERT DEPORTE');
  console.log(idclub, iddeporte, anio, categoriatxt, idcategoria, idaspirante);

  return new Promise(function(resolve, reject) {
    const { conexion } = require('../db/mysql');

    const query_str =
      'INSERT INTO becasdeportivas.datosclub (idclub, Deporte, Categoria, idAspirante, idclubdeportecategoria, anio,Direccion,Telefono,Dias) ' +
      'VALUES (?, ?, ?, ?, ?, ?,"","","") ';

    const query_var = [idclub, iddeporte, categoriatxt, idaspirante, idcategoria, anio];

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

//TODO LO QUE SIGUE ES DE VIVIENDAS, SE PUEDE ELIMINAR O REUTILIZAR EL ESQUELETO

module.exports.postHijo = (nro_hijo, id_persona, hijo) => {
  return new Promise(function(resolve, reject) {
    const { conexion } = require('../db/mysql');

    const query_str =
      'INSERT INTO viviendas.hijos (nombre, apellido, dni, fecha_creacion, id_persona_fk, nro_hijo)' +
      'VALUES (?, ?, ?, NOW(), ?, ?)';

    const query_var = [hijo.nombre, hijo.apellido, hijo.dni, id_persona, nro_hijo];

    conexion.query(query_str, query_var, function(err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};

module.exports.updateHijo = (nro_hijo, id_persona, hijo) => {
  return new Promise(function(resolve, reject) {
    const { conexion } = require('../db/mysql');

    const query_str =
      'UPDATE viviendas.hijos SET nombre=?, apellido=?, dni=? WHERE id_persona_fk = ? AND nro_hijo = ?';

    const query_var = [hijo.nombre, hijo.apellido, hijo.dni, id_persona, nro_hijo];

    conexion.query(query_str, query_var, function(err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};

module.exports.gethijoInfoByPersonaID = (id, nro_hijo) => {
  return new Promise(function(resolve, reject) {
    const { conexion } = require('../db/mysql');

    const query_str = 'SELECT * FROM viviendas.hijos WHERE id_persona_fk = ? AND nro_hijo = ?';

    const query_var = [id, nro_hijo];

    conexion.query(query_str, query_var, function(err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};

module.exports.postNuevoConyuge = (data, id_persona) => {
  return new Promise(function(resolve, reject) {
    const { conexion } = require('../db/mysql');

    const query_str =
      'INSERT INTO viviendas.conyuges(nombre, apellido, dni, fecha_creacion, id_personas_fk) VALUES (?, ?, ?, NOW(), ?)';

    const query_var = [data.nombre, data.apellido, data.dni, id_persona];

    conexion.query(query_str, query_var, function(err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};

module.exports.postUpdateInscriptos = (data, id) => {
  return new Promise(function(resolve, reject) {
    // The Promise constructor should catch any errors thrown on
    // this tick. Alternately, try/catch and reject(err) on catch.
    const { conexion } = require('../db/mysql');

    const query_str = `UPDATE viviendas.personas SET apenom=UPPER(?), nombre=(?), nacionalidad=?, nacimiento=?, estado_civil=? ,
        cant_hijos=? ,discapacidad=? ,tipo_vivienda=? , domicilio=?,localidad=? ,telefono=?,trabajo=?,ingresos=?,plan_social=?,
        ahu=? ,alta=NOW(),dni=?,email=?,observacion=? WHERE id = ? `;

    const query_var = [
      data.apellido,
      data.nombre,
      data.nacionalidad,
      data.startBirthDate.substring(0, 10),
      data.estado_civil,
      data.cant_hijos,
      data.discapacidad,
      data.vivienda_adaptada,
      data.domicilio,
      data.localidad,
      data.telefono,
      data.trabajo,
      data.ingreso_familiar,
      data.plan_social,
      data.plan_social,
      data.dni,
      data.email,
      data.observacion,
      id
    ];

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

module.exports.postUpdateConyuge = (data, id) => {
  return new Promise(function(resolve, reject) {
    // The Promise constructor should catch any errors thrown on
    // this tick. Alternately, try/catch and reject(err) on catch.
    const { conexion } = require('../db/mysql');

    const query_str = `UPDATE viviendas.conyuges SET nombre=UPPER(?), apellido=UPPER(?),dni=? WHERE id_personas_fk = ? `;

    const query_var = [data.nombre, data.apellido, data.dni, id];

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
