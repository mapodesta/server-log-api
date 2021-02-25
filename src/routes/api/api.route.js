import { Router } from 'express';
const apiRoute = Router();
import log from '../../middlewares/log';
import authenticate from '../../middlewares/authenticate';
import LoginController from '../../controllers/auth/cLogin';
import RegisterController from '../../controllers/auth/cRegister';
import ResetPasswordController from '../../controllers/auth/cResetPassword';
import InscripcionController from '../../controllers/cInscripcionController';
import InscriptosController from '../../controllers/cInscriptosController';

apiRoute.get('/welcome', (req, res) => {
  return res.status(200).json({
    success: true,
    data: null,
    message: 'Welcome to  api'
  });
});

// Authentication Routes...
apiRoute.post('/login', LoginController.login);

// Registration Routes...
apiRoute.post('/register', [log], RegisterController.register);
apiRoute.post('/account-verification', [log], RegisterController.accountVerification);
apiRoute.post('/account-verification-resend', [log], RegisterController.accountVerificationResend);

// Password Reset Routes...
apiRoute.post('/password/forgot', [log], ResetPasswordController.passwordForgot);
apiRoute.post(
  '/password/forgot-code-match',
  [log],
  ResetPasswordController.passwordForgotCodeMatch
);
apiRoute.post('/password/reset', [log], ResetPasswordController.passwordRest);

// Becas Routes...
apiRoute.get('/users/getinfobydni/:dni', InscripcionController.getInfoByDNI);
apiRoute.get('/users', InscripcionController.getAllUsers);
apiRoute.get('/users/getbarrios', InscripcionController.getBarrios);
apiRoute.get('/users/getclubes', InscripcionController.getClubes);
apiRoute.get('/users/deportesporclub/:idclub', InscripcionController.getDeportesPorClub);
apiRoute.get(
  '/users/getcategoriasporclub/:club/:deporte/:fechanac/:sexo',
  InscripcionController.getCategoriasPorDeporte
);

apiRoute.post('/nuevoinscripto', InscriptosController.postNuevoInscripto2);
apiRoute.get('/inscriptos', InscriptosController.getAllInscriptos);
apiRoute.get('/inscriptos/filter', InscriptosController.getAllEnrolledsByDate);
apiRoute.put('/inscripto/:id', InscriptosController.updateEnrolledById);
apiRoute.put('/inscripto/:id/state', InscriptosController.updateEnrolledState);
apiRoute.get('/inscripto/:dni', InscriptosController.getEnrolledByDni);

export default apiRoute;
