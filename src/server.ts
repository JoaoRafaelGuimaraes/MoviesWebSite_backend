import Fastify from 'fastify';
import userAuthRoutes from './routes/userAuthRoutes';
import userInfoRoutes from './routes/userInfoRoutes';
import userFavoritesRoutes from './routes/userFavoritesRoutes';
import titulosRoutes from './routes/titulosRoutes';

export const server = Fastify({
    logger: false,
});

// Rotas
userAuthRoutes(server);
userInfoRoutes(server);
userFavoritesRoutes(server);
titulosRoutes(server);

server.listen({ port: 3333 }, function (error, address) {
    if (error) {
        console.log(error);
        process.exit(1);
    }
    console.log(`Server listening on ${address}`);
});