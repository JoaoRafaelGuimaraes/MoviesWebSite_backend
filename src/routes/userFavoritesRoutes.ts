import { getFavorites } from "../controllers/getFavorites";

export default (server) => {

    server.post('/getfavorites', getFavorites);

}