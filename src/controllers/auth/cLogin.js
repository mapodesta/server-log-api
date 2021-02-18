import mLogin from '../../models/mLogin';
const md5 = require('md5');
import jwt from 'jsonwebtoken';
import secret from '../../config/jwt_secret';

class LoginController {
  /**
   * login user with user Credentials
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  static async login(req, res) {
    try {
      const { dni, password } = req.body;
      const user = await mLogin.getUserByDNIandPassword(dni, md5(password));

      // Validar codigos de respuesta y chequear error
      if (user.length === 0) {
        res.status(404).send({
          message: `Credenciales no validas`
        });
      } else {
        const token = jwt.sign({ sub: user[0].nrodni }, secret, { expiresIn: '2d' });

        res.status(200).send({ user: user[0].nrodni, token });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
}

export default LoginController;
