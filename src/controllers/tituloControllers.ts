import { FastifyRequest, FastifyReply } from 'fastify';

import { Titulo } from "../models/tituloInterface";
import { GetTitulosBody } from '../models/getTitulosBody';

import { getMoviesByYearAndGenre, getMovieByID } from "./filmeControllers";
import { getSeriesByYearAndGenre, getSerieByID } from "./serieControllers";

import { fetchFromAPI, language } from './tituloAux';
import { SearchTituloBody } from '../models/searchTituloBody';

async function getTitulosByYearAndGenre(ano: number | undefined, genre: number | string | undefined) {
    try {
        const [movies, series] = await Promise.all([getMoviesByYearAndGenre(ano, genre), getSeriesByYearAndGenre(ano, genre)]);

        const intercalados: any[] = [];

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

async function getTituloInfo(id: number, tipo: string) {
    try {
        if (tipo === 'filme') {
            const filme = await getMovieByID(id);
            return filme;

        } else if (tipo === 'serie') {
            const serie = await getSerieByID(id);
            return serie;

        } else {
            throw new Error('Tipo de título inválido: ' + tipo);
        }
        
    } catch (error) {
        throw error;
    }
}

const getTitulos = async (request: FastifyRequest, reply: FastifyReply) => {
    const { tipo, ano, genero } = request.query as GetTitulosBody;

    var titulosPromises: Promise<any>[] = [];

    if (tipo == 'filmes') {
        titulosPromises = await getMoviesByYearAndGenre(ano, genero);
    } else if (tipo == 'series') {
        titulosPromises = await getSeriesByYearAndGenre(ano, genero);
    } else if (tipo == 'titulos') {
        titulosPromises = await getTitulosByYearAndGenre(ano, genero);
    } else {
        reply.status(400).send({ erro: 'Tipo de título inválido' });
        return;
    }

    const resposta = await Promise.all(titulosPromises);

    if (resposta) {
        reply.status(200).send(resposta);
    } else {
        reply.status(500).send({ erro: 'Erro ao buscar ' + tipo });
    }
};

const searchTitulos = async (request: FastifyRequest, reply: FastifyReply) => {
    const { nome } = request.query as SearchTituloBody;

    try {
        const data = await fetchFromAPI('https://api.themoviedb.org/3/search/multi', {
            api_key: process.env.TMDB_API_KEY,
            query: nome,
            language: language,
            media_type: 'movie, tv'
        });

        const tituloPromises = data.results.map(media => {
            if (media.media_type === 'movie') {
                return getTituloInfo(media.id, 'filme');
            } else if (media.media_type === 'tv') {
                return getTituloInfo(media.id, 'serie');
            }
            return null;
        });

        const titulos = await Promise.all(tituloPromises);

        reply.status(200).send(titulos.filter(titulo => titulo !== null));

    } catch (error) {
        reply.status(500).send({ erro: 'Erro ao buscar títulos' });
    }
};

export { getTitulosByYearAndGenre, getTituloInfo, getTitulos, searchTitulos };