import { getMoviesByYear, getMoviesByYearAndGenre } from "./filmeControllers";
import { getSeriesByYear, getSeriesByYearAndGenre } from "./serieControllers";

import { auth, admin } from '../firebase/firebaseConfig';
import { FastifyRequest, FastifyReply } from 'fastify';

import { Titulo } from "../models/tituloInterface";
import { postFavoriteBody } from "../models/postFavoriteBody";

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

async function postTitulosAsFavorite (request: FastifyRequest, reply: FastifyReply) {
    try{

        const user = await auth.currentUser;
        const { filme_id } = request.body as postFavoriteBody;

        if (user){

            await admin.firestore().collection("usuarios").doc(user.uid).collection("favoritos").doc(filme_id).set({id: filme_id})
            
            reply.status(200).send({ mensagem: 'Titulo adicionado aos favoritos'});
            
        }

        else{
            reply.status(401).send({erro: "Nenhum usuário logado"});
        }
    }

    catch (error) {
        console.error('Erro ao adicionar favorito:', error);
        reply.status(500).send({ erro: 'Erro ao adicionar favorito: ', error });
    }   
}

export { getTitulosByYear, getTitulosByYearAndGenre, postTitulosAsFavorite };