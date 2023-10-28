import { 
    getTitulos,
 } from '../controllers/tituloControllers';

export default (server) => {
    server.get('/getTitulos', getTitulos);
}