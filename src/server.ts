import Fastify from 'fastify';
import cors from '@fastify/cors';

import userAuthRoutes from './routes/userAuthRoutes';
import userInfoRoutes from './routes/userInfoRoutes';
import userFavoritesRoutes from './routes/userFavoritesRoutes';
import titulosRoutes from './routes/titulosRoutes';

import dotenv from 'dotenv';
dotenv.config();

const PORT = Number(process.env.PORT) || 8080;

export const server = Fastify({
    logger: false,
});

server.register(cors, {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST", "OPTIONS"]
});

// Rotas
userAuthRoutes(server);
userInfoRoutes(server);
userFavoritesRoutes(server);
titulosRoutes(server);

server.listen(3333, function (error, address) {
    if (error) {
        console.log(error);
        process.exit(1);
    }
    console.log(`Server listening on ${address}`);
});