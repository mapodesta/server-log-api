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
apiRoute.get('/getinfobydesc', ServerController.getInfoByDESC);
apiRoute.get('/geterrores', ServerController.getErrores);
apiRoute.get('/getservers', ServerController.getServers);
apiRoute.get('/gettopservers', ServerController.getTopServers);

export default apiRoute;
