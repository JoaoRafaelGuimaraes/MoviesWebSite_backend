import { FastifyRequest, FastifyReply } from 'fastify';
import axios from 'axios';

import { Titulo } from "../models/tituloInterface";
import { GetTitulosBody } from '../models/getTitulosBody';

import { getMoviesByYearAndGenre, getMovieByID } from "./filmeControllers";
import { getSeriesByYearAndGenre, getSerieByID } from "./serieControllers";

import { API_KEY, language } from './tituloAux';
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
        const response = await axios.get('https://api.themoviedb.org/3/search/multi', {
            params: {
                api_key: API_KEY,
                query: nome,
                language: language,
                media_type: 'movie, tv'
            }
        });

        const titulos: any[] = [];
        const tituloPromises: Promise<any>[] = [];

        response.data.results.forEach(media => {
            if (media.media_type === 'movie') {
                media.media_type = 'filme';
            } else if (media.media_type === 'tv') {
                media.media_type = 'serie';
            }

            const tituloPromise = getTituloInfo(media.id, media.media_type);

            tituloPromises.push(tituloPromise);
        });

        const titulosInfo = await Promise.all(tituloPromises);

        titulosInfo.forEach(titulo => {
            if (titulo) {
                titulos.push(titulo);
            } else {
                throw new Error('Erro ao buscar título');
            }
        });

        reply.status(200).send(titulos);

    } catch (error) {
        reply.status(500).send({ erro: 'Erro ao buscar títulos' });
    }
};

export { getTitulosByYearAndGenre, getTituloInfo, getTitulos, searchTitulos };