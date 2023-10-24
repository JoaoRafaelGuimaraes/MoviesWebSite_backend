import { auth, admin } from '../firebase/firebaseConfig';
import { FastifyRequest, FastifyReply } from 'fastify';

import { getMoviesByYear, getMoviesByYearAndGenre, getMovieByID } from "./filmeControllers";
import { getSeriesByYear, getSeriesByYearAndGenre, getSerieByID } from "./serieControllers";

import { Titulo } from "../models/tituloInterface";
import { PostFavoriteBody } from '../models/postFavoriteBody';
import { GetFavoriteBody } from "../models/getFavoriteBody";
import { RemoveFavoriteParams } from '../models/removeFavoriteParams';

export async function getTituloInfo(id: number, tipo: string) {
    try {
        if (tipo === 'filme') {
            const filme = await getMovieByID(id);
            return filme;

        } else if (tipo === 'serie') {
            const serie = await getSerieByID(id);
            return serie;

        } else {
            throw new Error('Tipo de título inválido');
        }
        
    } catch (error) {
        throw error;
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

// FAVORITOS ---------------------------------------------------------------------------------------------------------------

async function postTituloAsFavorite(request: FastifyRequest, reply: FastifyReply) {
    try {
        const user = await auth.currentUser;
        const { id, tipo, generos } = request.body as PostFavoriteBody;

        if (user) {
            const favoritoRef = admin.firestore().collection('usuarios').doc(user.uid).collection('favoritos').doc(id);

            // Verifica se o documento já existe antes de adicioná-lo
            const favoritoPossivel = await favoritoRef.get();

            if (!favoritoPossivel.exists) {
                await favoritoRef.set({ id, tipo, generos });

                reply.status(200).send({ mensagem: 'Título adicionado aos favoritos' });

            } else {
                reply.status(400).send({ erro: 'Título já está nos favoritos' });
            }

        } else {
            reply.status(401).send({ erro: 'Nenhum usuário logado' });
        }

    } catch (error) {
        console.error('Erro ao adicionar favorito:', error);
        reply.status(500).send({ erro: 'Erro ao adicionar favorito: ' + error.message });
    }
}

const removeTituloFromFavorites = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.body as RemoveFavoriteParams;

    try {
        // Obtém o usuário atual
        const user = await auth.currentUser;

        if (user) {
            const uid = user.uid;

            // Acessa a subcoleção 'favoritos' do usuário
            const favoritosRef = admin.firestore().collection('usuarios').doc(uid.toString()).collection('favoritos');

            try {
                // Remove o documento do título da subcoleção 'favoritos'
                await favoritosRef.doc(id.toString()).delete();

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

const getFavorites = async (request: FastifyRequest, reply: FastifyReply) => {
    const { tipo, genero } = request.query as GetFavoriteBody;

    const user = await auth.currentUser;

    if (!user) {
        reply.status(401).send({ erro: 'Usuário não autenticado' });
        return;
    }

    // Acessa a subcoleção de usuário 'favoritos'
    const favoritosRef = admin.firestore().collection('usuarios').doc(user.uid.toString()).collection('favoritos');

    try {
        let query = favoritosRef;

        // Aplicar filtro de tipo se 'tipo' for definido
        if (tipo !== undefined) {
            query = query.where('tipo', '==', tipo);
        }

        // Aplicar filtro de gênero se 'genero' for definido
        if (genero !== undefined) {
            query = query.where('generos', 'array-contains', genero);
        }

        const favoritos = await query.get();

        const titulosPromises: Promise<any>[] = [];

        favoritos.forEach(favorito => {
            const tituloInfoPromise = getTituloInfo(favorito.data().id, favorito.data().tipo);
            titulosPromises.push(tituloInfoPromise);
        });

        // Aguardar todas as promises serem resolvidas
        const titulos = await Promise.all(titulosPromises);

        reply.status(200).send(titulos);

    } catch (error) {
        console.error('Erro ao buscar favoritos:', error);
        reply.status(500).send({ erro: 'Erro ao buscar favoritos: ' + error.message });
    }
};

export { getTitulosByYear, getTitulosByYearAndGenre, 
    postTituloAsFavorite, removeTituloFromFavorites, getFavorites };