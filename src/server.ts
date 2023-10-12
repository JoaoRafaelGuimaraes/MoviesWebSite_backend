import Fastify from 'fastify';

export const server = Fastify({
    logger: false,
});

import { loginEmailAndPassController, registerEmailAndPassController } from './controllers/authControllers';

// Rota para login com email e senha
server.post('/login', loginEmailAndPassController);

// Rota para registro com email e senha
server.post('/register', registerEmailAndPassController);

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

server.listen({ port: 3333 }, function (error, address) {
    if (error) {
        console.log(error);
        process.exit(1);
    }
    console.log(`Server listening on ${address}`);
});