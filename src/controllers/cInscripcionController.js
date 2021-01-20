const mInscripcion = require('../models/mInscripcion');
const mInscriptos = require('../models/mInscriptos');

class InscripcionController {
  /**
   * get all Calles
   * @param req
   * @param res
   * @returns {JSON Object}
   */

  static async getInfoByDNI(req, res) {
    try {
      let userInfo = await mInscripcion.getUserInfoByDNI(req.params.dni);

      if (!userInfo.length) {
        res.status(200).send({
          message: `No se encontraron resultados`
        });
      } else {
        res.status(200).send(userInfo);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }

  static async getBarrios(req, res) {
    try {
      let barrios = await mInscripcion.getBarrios();
      if (!barrios.length) {
        res.status(200).send({
          message: `No se encontraron resultados`
        });
      } else {
        res.status(200).send(barrios);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }

  static async getClubes(req, res) {
    try {
      let clubes = await mInscripcion.getClubes();
      if (!clubes.length) {
        res.status(200).send({
          message: `No se encontraron resultados`
        });
      } else {
        res.status(200).send(clubes);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }

  static async getDeportesPorClub(req, res) {
    try {
      let deportesporclub = await mInscripcion.getDeportesPorClub(req.params.idclub);
      console.log(deportesporclub);
      if (!deportesporclub.length) {
        res.status(200).send({
          message: `No se encontraron resultados`
        });
      } else {
        res.status(200).send(deportesporclub);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }

  static async getAllUsers(req, res) {
    try {
      const allInfo = await mInscripcion.getAllUsers();

      if (!allInfo.length) {
        res.status(200).send({
          message: `No se encontraron resultados`
        });
      } else res.status(200).send(allInfo);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
}

export default InscripcionController;
