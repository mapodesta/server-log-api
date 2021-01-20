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
    try {
      let now = new Date();
      now = now.toISOString().substring(0, 10);
      const validacion = await mInscripcion.getUserInfoByDNIandDate(req.body.dni, now);
      if (validacion.length === 0) {
        try {
          const nuevoInscripto = await mInscriptos.postNuevoInscripto(req.body);
          console.log("Inscripto!")
          res.status(200).send({ message: "Registro creado exitosamente. " })
        } catch (error) {
          console.log(error);
          res.status(500).send(error);
        }
      } else {
        // UPDATE
        await mInscriptos.postUpdateInscriptos(req.body, validacion[0].id);

        const existeConyuge = await mInscriptos.getConyugeInfoByPersonaID(validacion[0].id);
        if (existeConyuge.length)
          await mInscriptos.postUpdateConyuge(req.body.conyuge, validacion[0].id);
        else
          await mInscriptos.postNuevoConyuge(req.body.conyuge, validacion[0].id);

        const existeHijo1 = await mInscriptos.gethijoInfoByPersonaID(validacion[0].id, "1")
        if (existeHijo1.length) {
          await mInscriptos.updateHijo('1', validacion[0].id, req.body.hijo1);
        } else {
          console.log("postHijo 1")
          await mInscriptos.postHijo('1', validacion[0].id, req.body.hijo1);
        }

        const existeHijo2 = await mInscriptos.gethijoInfoByPersonaID(validacion[0].id, "2")
        if (existeHijo2.length)
          await mInscriptos.updateHijo('2', validacion[0].id, req.body.hijo2);
        else
          await mInscriptos.postHijo('2', validacion[0].id, req.body.hijo2);

        const existeHijo3 = await mInscriptos.gethijoInfoByPersonaID(validacion[0].id, "3")
        if (existeHijo3.length)
          await mInscriptos.updateHijo('3', validacion[0].id, req.body.hijo3);
        else
          await mInscriptos.postHijo('3', validacion[0].id, req.body.hijo3);

        const existeHijo4 = await mInscriptos.gethijoInfoByPersonaID(validacion[0].id, "4")
        if (existeHijo4.length)
          await mInscriptos.updateHijo('4', validacion[0].id, req.body.hijo4);
        else
          await mInscriptos.postHijo('4', validacion[0].id, req.body.hijo4);

        const existeHijo5 = await mInscriptos.gethijoInfoByPersonaID(validacion[0].id, "5")
        if (existeHijo5.length)
          await mInscriptos.updateHijo('5', validacion[0].id, req.body.hijo5);
        else
          await mInscriptos.postHijo('5', validacion[0].id, req.body.hijo5);

        const existeHijo6 = await mInscriptos.gethijoInfoByPersonaID(validacion[0].id, "6")
        if (existeHijo6.length)
          await mInscriptos.updateHijo('6', validacion[0].id, req.body.hijo6);
        else
          await mInscriptos.postHijo('6', validacion[0].id, req.body.hijo6);

        const existeHijo7 = await mInscriptos.gethijoInfoByPersonaID(validacion[0].id, "7")
        if (existeHijo7.length)
          await mInscriptos.updateHijo('7', validacion[0].id, req.body.hijo7);
        else
          await mInscriptos.postHijo('7', validacion[0].id, req.body.hijo7);

        const existeHijo8 = await mInscriptos.gethijoInfoByPersonaID(validacion[0].id, "8")
        if (existeHijo8.length)
          await mInscriptos.updateHijo('8', validacion[0].id, req.body.hijo8);
        else
          await mInscriptos.postHijo('8', validacion[0].id, req.body.hijo8);

        const existeHijo9 = await mInscriptos.gethijoInfoByPersonaID(validacion[0].id, "9")
        if (existeHijo9.length)
          await mInscriptos.updateHijo('9', validacion[0].id, req.body.hijo9);
        else
          await mInscriptos.postHijo('9', validacion[0].id, req.body.hijo9);

        const existeHijo10 = await mInscriptos.gethijoInfoByPersonaID(validacion[0].id, "10")
        if (existeHijo10.length)
          await mInscriptos.updateHijo('10', validacion[0].id, req.body.hijo10);
        else
          await mInscriptos.postHijo('10', validacion[0].id, req.body.hijo10);

        console.log("Actualizado !")
        res.status(200).send({ message: "Registro actualizado exitosamente. " })
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
}

export default InscriptoController;
