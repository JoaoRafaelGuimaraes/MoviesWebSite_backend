import { 
    loginEmailAndPassController, 
    registerEmailAndPassController,
    logoutController,
    resetPasswordController,
    changePasswordController,
    loginGoogleController,
    loginFacebookController
    } from '../controllers/userAuthControllers';

export default (server) => {
    server.post('/login', loginEmailAndPassController);
    server.post('/register', registerEmailAndPassController);
    server.post('/logout', logoutController);
    server.post('/resetPassword', resetPasswordController);
    server.post('/changePassword', changePasswordController);
    server.post('/loginGoogle', loginGoogleController);
    server.post('/loginFacebook', loginFacebookController);
}