import { Router } from 'express';
const apiRoute = Router();
import ServerController from '../../controllers/cServerController';

apiRoute.get('/welcome', (req, res) => {
  return res.status(200).json({
    success: true,
    data: null,
    message: 'Welcome to  api'
  });
});

// Server Routes...
//EndPoint to obtain erros by error description
apiRoute.get('/users/getinfobydesc', ServerController.getInfoByDESC);
apiRoute.get('/users/geterrores', ServerController.getErrores);
apiRoute.get('/users/getservers', ServerController.getServers);
apiRoute.get('/users/gettopservers', ServerController.getTopServers);

export default apiRoute;
