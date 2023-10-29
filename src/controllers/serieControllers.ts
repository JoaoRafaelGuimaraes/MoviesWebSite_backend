import dotenv from 'dotenv';

import { Titulo } from '../models/tituloInterface';

import { language, fetchFromAPI } from './tituloAux';
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
    const data = await fetchFromAPI('https://api.themoviedb.org/3/tv/' + id, {
        api_key: process.env.TMDB_API_KEY,
        language: language
    });
    
    // Informações da rota de Details
    const { name, first_air_date, genres, overview, poster_path, backdrop_path } = data;
   
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

async function getSeriesByYearAndGenre(year: number | undefined, genre: number | string | undefined) {

    const genreMapping = {
        'Ação': 'Ação & Aventura',
        'Ficção científica': 'Sci-Fi & Fantasy',
        'Terror': 'Mistério'
    };

    try {
        const params: Record<string, any> = {
            api_key: process.env.TMDB_API_KEY,
            language: language,
            sort_by: 'popularity.desc'
        };

        if (year !== undefined) {
            params.first_air_date_year = year;
        }
        if (genre !== undefined) {
            genre = genreMapping[genre] || genre;

            // Mapeia o genero pra o id correspondente
            const genreId = Object.keys(serieGenreMap).find(key => serieGenreMap[key] === genre);
            params.with_genres = genreId;
        }
    
        const data = await fetchFromAPI('https://api.themoviedb.org/3/discover/tv', params);
    
        const seriesPromises = data.results.map(serie => getSerieByID(serie.id));

        const series = await Promise.all(seriesPromises);

        return series.filter(serie => serie !== null && serie !== undefined);

    } catch (error) {
        throw error;
    }
}

async function getSimilarSeriesById(id: number) {
    try {
        const data = await fetchFromAPI('https://api.themoviedb.org/3/tv/' + id + '/similar', {
            api_key: process.env.TMDB_API_KEY,
            language: language
        });

        const seriesPromises = data.results.map(serie => getSerieByID(serie.id));

        const series = await Promise.all(seriesPromises);

        return series.filter(serie => serie !== null && serie !== undefined);

    } catch (error) {
        throw error;
    }
}

export { getSerieByID, getSeriesByYearAndGenre, getSimilarSeriesById };