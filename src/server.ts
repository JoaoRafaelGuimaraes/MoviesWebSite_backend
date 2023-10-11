import Fastify from 'fastify';

const fastify = Fastify({
    logger: false,

});

fastify.listen({port: 3333}, function (error, address) {
    if (error) {
        console.log(error);
        process.exit(1);
    }
    console.log(`Server listening on ${address}`);
});