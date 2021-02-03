const mInscriptos = require('../models/mInscriptos');
const mInscripcion = require('../models/mInscripcion');

class InscriptoController {
  /**
   * postNuevoInscripto2
   * @param req
   * @param res
   * @returns {JSON Object}
   */

  static async postNuevoInscripto2(req, res) {
    console.log('DATA EN CONTROLADOR');
    console.log(req.body);
    if (req.body.sexo === 'Masculino') {
      req.body.sexoAspiranteDB = 'M';
    } else {
      req.body.sexoAspiranteDB = 'F';
    }
    if (req.body.sexoTutor === 'Femenino') {
      req.body.sexoTutorDB = 'F';
    } else {
      req.body.sexoTutorDB = 'M';
    }
    try {
      const anio = new Date().getFullYear();
      const validacion = await mInscripcion.getUserInfoByDNIandDate(req.body.dni, anio);
      console.log('SE VERIFICA SI YA EXISTE LA PERSONA EN LA DB');
      console.log(validacion);
      if (validacion.length === 0) {
        try {
          const nuevoInscripto = await mInscriptos.postNuevoInscripto(req.body);
          console.log('Inscripto!');
          console.log(nuevoInscripto.insertId);

          const nuevoInscriptoTutor = await mInscriptos.postNuevoInscriptoTutor(
            req.body,
            nuevoInscripto.insertId
          );


          //ver si hay que eliminar
         // const updateCupo = await mInscriptos.updateCupo(req.body.categoriaSelected.value);

          const nuevaBeca = await mInscriptos.postNuevaBeca(
            req.body.clubSelected.value,
            req.body.deporteSelected.value,
            anio,
            req.body.categoriaSelected.label,
            req.body.categoriaSelected.value,
            nuevoInscripto.insertId
          );
          res.status(200).send({ message: 'Registro creado exitosamente. ' });
        } catch (error) {
          console.log(error);
          res.status(500).send(error);
        }
      } else {
        // UPDATE
        await mInscriptos.postUpdateInscriptos(req.body, validacion[0].id);

        console.log('Actualizado !');
        res.status(200).send({ message: 'Registro actualizado exitosamente. ' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
}

export default InscriptoController;
