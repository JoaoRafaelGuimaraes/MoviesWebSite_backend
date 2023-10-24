import { FastifyRequest, FastifyReply } from 'fastify';
import { auth, admin } from '../firebase/firebaseConfig';

import { getMoviesByYear, getMoviesByYearAndGenre } from "./filmeControllers";
import { getSeriesByYear, getSeriesByYearAndGenre } from "./serieControllers";

import { Titulo } from "../models/tituloInterface";
import { FavoriteBody } from '../models/favoriteBody';

async function getTitulosByYear(ano: number) {
    try {
        // Use Promise.all para buscar filmes e séries simultaneamente
        const [movies, series] = await Promise.all([getMoviesByYear(ano), getSeriesByYear(ano)]);

        const intercalados: Titulo[] = [];

        while (movies.length > 0 || series.length > 0) {
            if (movies.length > 0) {
                intercalados.push(movies.shift() as Titulo);
            }
            if (series.length > 0) {
                intercalados.push(series.shift() as Titulo);
            }
        }

        return intercalados;
    } catch (error) {
        throw error;
    }
}

async function getTitulosByYearAndGenre(ano: number, genre: number | string) {
    try {
        const [movies, series] = await Promise.all([getMoviesByYearAndGenre(ano, genre), getSeriesByYearAndGenre(ano, genre)]);

        const intercalados: Titulo[] = [];

        while (movies.length > 0 || series.length > 0) {
            if (movies.length > 0) {
                intercalados.push(movies.shift() as Titulo);
            }
            if (series.length > 0) {
                intercalados.push(series.shift() as Titulo);
            }
        }

        return intercalados;

    } catch (error) {
        throw error;
    }
}

const removeTitleFromFavorites = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.body as FavoriteBody;

    try {
        // Obtém o usuário atual
        const user = await auth.currentUser;

        if (user) {
            const uid = user.uid;

            // Acessa a subcoleção 'favoritos' do usuário
            const favoritosRef = admin.firestore().collection('usuarios').doc(uid).collection('favoritos');

            try {
                // Remove o documento do título da subcoleção 'favoritos'
                await favoritosRef.doc(`${id}`).delete();

                reply.status(200).send({ mensagem: 'Título removido dos favoritos com sucesso' });

            } catch (error) {
                console.error('Erro ao remover título dos favoritos:', error);
                reply.status(404).send({ erro: 'Título não está nos favoritos' });
            }
        }

    } catch (error) {
        console.error('Erro ao remover título dos favoritos:', error);
        reply.status(401).send({ erro: 'Usuário não autenticado' });
    }
};

export { getTitulosByYear, getTitulosByYearAndGenre, removeTitleFromFavorites };