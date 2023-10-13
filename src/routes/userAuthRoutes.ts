/* 
Funções necessárias:
- registrar com email e senha X
- registrar com conta do google

- confirmação de email X

- login com email e senha X
- login com conta do google

- logout X

- "esqueci minha senha" por meio do email X
- alterar senha (senha atual e nova senha) X

*/
import { 
    loginEmailAndPassController, 
    registerEmailAndPassController,
    logoutController,
    resetPasswordController,
    changePasswordController
    } from '../controllers/userAuthControllers';

export default (server) => {
    server.post('/login', loginEmailAndPassController);
    server.post('/register', registerEmailAndPassController);
    server.post('/logout', logoutController);
    server.post('/resetPassword', resetPasswordController);
    server.post('/changePassword', changePasswordController);
}