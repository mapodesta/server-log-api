import mLogin from '../../models/mLogin';
const md5 = require('md5');

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

            if (!user.length) {
                res.status(401).send({
                    message: `Credenciales no validas`
                });
            } else res.status(200).send(user);
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
}

export default LoginController;