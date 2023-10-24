import { getUserInfo, changeEmailController } from "../controllers/UserInfoControllers";

import{ postTitulosAsFavorite} from "../controllers/tituloControllers"

export default(server) => {
    server.post('/getinfo', getUserInfo);
    server.post('/changeEmail', changeEmailController);
}