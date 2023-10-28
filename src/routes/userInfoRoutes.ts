import { getUserInfo, changeEmailController } from "../controllers/userInfoControllers";

export default(server) => {
    server.get('/getUserInfo', getUserInfo);
    server.put('/changeEmail', changeEmailController);
}