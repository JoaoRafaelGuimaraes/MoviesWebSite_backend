import { 
    getTitulos, searchTitulos
 } from '../controllers/tituloControllers';

export default (server) => {
    server.get('/getTitulos', getTitulos);
    server.get('/searchTitulos', searchTitulos);
}