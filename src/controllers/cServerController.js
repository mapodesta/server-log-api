const mServer = require('../models/mServer');

class ServerController {
  /**
   * @param req
   * @param res
   * @returns {JSON Object}
   */

  static async getInfoByDESC(req, res) {
    const { descripcion = '', server = '' } = req.query;

    try {
      let serverInfo = await mServer.getServerInfoByDESC(descripcion, server);

      if (!serverInfo.length) {
        res.status(200).send({
          message: `No se encontraron resultados`
        });
      } else {
        res.status(200).send(serverInfo);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }

  static async getErrores(req, res) {
    try {
      let serversErrors = await mServer.getErrores();
      if (!serversErrors.length) {
        res.status(200).send({
          message: `No se encontraron resultados`
        });
      } else {
        res.status(200).send(serversErrors);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }

  static async getServers(req, res) {
    try {
      let serversList = await mServer.getServers();
      if (!serversList.length) {
        res.status(200).send({
          message: `No se encontraron resultados`
        });
      } else {
        res.status(200).send(serversList);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }

  static async getTopServers(req, res) {
    try {
      let serversTopList = await mServer.getTopServers();
      if (!serversTopList.length) {
        res.status(200).send({
          message: `No se encontraron resultados`
        });
      } else {
        res.status(200).send(serversTopList);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
}

export default ServerController;
