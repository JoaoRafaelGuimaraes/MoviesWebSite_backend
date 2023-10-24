import axios from 'axios';
import dotenv from 'dotenv';

import { Titulo } from '../models/tituloInterface';

import { language } from './tituloAux';
import { getSerieCastById, getSerieNumSeasonsById, getSeriePGRatingById } from './tituloAux';

dotenv.config();

const serieGenreMap = {
    '10759': 'Ação & Aventura',
    '16': 'Animação',
    '35': 'Comédia',
    '80': 'Crime',
    '99': 'Documentário',
    '18': 'Drama',
    '10751': 'Família',
    '10762': 'Kids',
    '9648': 'Mistério',
    '10763': 'News',
    '10764': 'Reality',
    '10765': 'Sci-Fi & Fantasy',
    '10766': 'Soap',
    '10767': 'Talk',
    '10768': 'War & Politics',
    '37': 'Faroeste'
};

async function getSerieByID(id: number) {
    const response = await axios.get('https://api.themoviedb.org/3/tv/' + id, {
        params: {
            api_key: process.env.TMDB_API_KEY,
            language: language
        }
    });
    
    // Informações da rota de Details
    const { name, first_air_date, genres, overview, poster_path, backdrop_path } = response.data;
   
    // Informações de outras rotas
    const [cast, seasons, pg] = await Promise.all([
        getSerieCastById(id),
        getSerieNumSeasonsById(id),
        getSeriePGRatingById(id)
    ]);

    // Mapeia os gêneros pra strings
    const generos = genres.map(genre => serieGenreMap[genre.id.toString()]);

    const serie: Titulo = {
        id: id,
        titulo: name,
        ano: first_air_date.slice(0, 4),
        duracao: seasons,
        generos: generos,
        classificacao_indicativa: pg,
        sinopse: overview,
        elenco: cast,
        poster_path: poster_path,
        backdrop_path: backdrop_path
    }

    return serie;
}

async function getSeriesByYear(ano: number) {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/discover/tv', {
        params: {
            api_key: process.env.TMDB_API_KEY,
            language: language,
            first_air_date_year: ano,
            sort_by: 'popularity.desc'
            }
        });
    
        const series: any[] = [];

        response.data.forEach(serie => {
            const titulo = getSerieByID(serie.id);

            if (titulo) {
                series.push(titulo);
            } else {
                throw new Error('Erro ao buscar título');
            }
        });

        return series;
    
    } catch (error) {
        throw error;
    }
}

async function getSeriesByYearAndGenre(year: number, genre: number | string) {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/discover/tv', {
          params: {
            api_key: process.env.TMDB_API_KEY,
            language: language,
            primary_release_year: year,
            with_genres: genre,
            sort_by: 'popularity.desc'
          }
        });
    
        const series: any[] = [];

        response.data.forEach(serie => {
            const titulo = getSerieByID(serie.id);

            if (titulo) {
                series.push(titulo);
            } else {
                throw new Error('Erro ao buscar título');
            }
        });

        return series;

    } catch (error) {
        throw error;
    }
}

async function getSimilarSeriesById(id: number) {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/tv/' + id + '/similar', {
            params: {
                api_key: process.env.TMDB_API_KEY,
                language: language
            }
        });

        const series: any[] = [];

        response.data.forEach(serie => {
            const titulo = getSerieByID(serie.id);

            if (titulo) {
                series.push(titulo);
            } else {
                throw new Error('Erro ao buscar título');
            }
        });

        return series;

    } catch (error) {
        throw error;
    }
}

export { getSerieByID, getSeriesByYear, getSeriesByYearAndGenre, getSimilarSeriesById };