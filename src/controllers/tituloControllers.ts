import { getMoviesByYear, getMoviesByYearAndGenre, getMovieByID } from "./filmeControllers";
import { getSeriesByYear, getSeriesByYearAndGenre, getSerieByID } from "./serieControllers";

import { auth, admin } from '../firebase/firebaseConfig';
import { FastifyRequest, FastifyReply } from 'fastify';

import { Titulo } from "../models/tituloInterface";
import { FavoriteBody } from '../models/favoriteBody';
import { postFavoriteBody } from "../models/postFavoriteBody";


async function getMediaType(mediaID: any)
{
    try{
        const movie = await getMovieByID(mediaID)
        return movie;
    }catch(error){
        if (error.response && error.response.status === 404) {
            try{
                const serie = await getSerieByID(mediaID)
                return serie
            }catch(tverror){
                console.error('MediaID não encontrado!')
                return 'Título não encontrado';
            }
        }
    }

}

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

//Função adicionada: retornar apenas uma string que indica se é um filme ou série
//diferente de getMediaType que retorna todos os detalhes de um titulo, dificultando
//para pegar apenas o tipo de midia do titulo // coloquei tv ao invés de serie por causa da API TMDB
async function isMovieOrSerie(idTitulo: number): Promise<string> {
    try {
        await getMovieByID(idTitulo);
        return "movie"; //se encontrar com esse ID nessa função, é um filme!
    } catch (error) {
        if (error.response && error.response.status === 404) {
            // se retornar 404, not found, pode ser uma série
            try {
                await getSerieByID(idTitulo);
                return "tv"; // se der certo na função de pegar série, é uma série
            } catch (tverror) {
                return "not found"; //se nenhuma das duas der certo, não é filme nem série, nem exite
            }
        } else {
            throw error; //para erros diferentes do Not Found
        }
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

export { getTitulosByYear, getTitulosByYearAndGenre, postTitulosAsFavorite, removeTitleFromFavorites, getMediaType, isMovieOrSerie };