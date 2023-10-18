import Fastify from 'fastify';
import userAuthRoutes from './routes/userAuthRoutes';
import userInfoRoutes from './routes/userInfoRoutes';

export const server = Fastify({
    logger: false,
});

// Rotas
userAuthRoutes(server);
userInfoRoutes(server);

server.listen({ port: 3333 }, function (error, address) {
    if (error) {
        console.log(error);
        process.exit(1);
    }
    console.log(`Server listening on ${address}`);
});