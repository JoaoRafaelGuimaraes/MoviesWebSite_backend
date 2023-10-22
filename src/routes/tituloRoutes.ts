import { postTitulosAsFavorite } from "../controllers/tituloControllers"

export default (server) => { 
  server.post('/favoritos', postTitulosAsFavorite);
}