import { 
    postTituloAsFavorite, removeTituloFromFavorites, getFavorites, isUserFavorite
 } from "../controllers/favoritoControllers";

export default (server) => {
    server.post('/postFavorite', postTituloAsFavorite);
    server.post('/removeFavorite', removeTituloFromFavorites);
    server.get('/getFavorites', getFavorites);
    server.get('/isUserFavorite', isUserFavorite)
}