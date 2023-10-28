import { postTituloAsFavorite, removeTituloFromFavorites, getFavorites } from "../controllers/favoritoControllers";

export default (server) => {
    server.post('/postFavorite', postTituloAsFavorite);
    server.post('/removeFavorite', removeTituloFromFavorites);
    server.get('/getFavorites', getFavorites);
}