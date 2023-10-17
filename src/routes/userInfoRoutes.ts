import { getUserInfo } from "../controllers/UserInfoControllers";


export default(server) => {

    server.post('/getinfo',getUserInfo );
}