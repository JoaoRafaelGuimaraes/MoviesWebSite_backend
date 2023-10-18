import { getUserInfo, changeEmailController } from "../controllers/UserInfoControllers";

export default(server) => {
    server.post('/getinfo', getUserInfo);
    server.post('/changeEmail', changeEmailController);
}