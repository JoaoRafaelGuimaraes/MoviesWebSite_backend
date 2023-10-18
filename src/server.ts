import Fastify from 'fastify';
import userAuthRoutes from './routes/userAuthRoutes';
import userInfoRoutes from './routes/userInfoRoutes';

export const server = Fastify({
    logger: false,
});

// Swagger para testar a API
server.register(require('@fastify/swagger'), {})
server.register(require('@fastify/swagger-ui'), {
    routePrefix: '/docs', // Rota onde a documentação estará disponível
    swagger: {
        info: {
            title: 'Minha API',
            description: 'Descrição da minha API',
            version: '1.0.0',
        },
    },
    exposeRoute: true,
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