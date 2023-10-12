/* 
Funções necessárias:
- registrar com email e senha X
- registrar com conta do google

- confirmação de email X

- login com email e senha X
- login com conta do google

- logout X

- alterar senha por meio do email
*/
import { 
    loginEmailAndPassController, 
    registerEmailAndPassController,
    logoutController
    } from '../controllers/authControllers';

export default (server) => {
    server.post('/loginEmailAndPass', loginEmailAndPassController);
    server.post('/registerEmailAndPass', registerEmailAndPassController);
    server.post('/logout', logoutController);
}