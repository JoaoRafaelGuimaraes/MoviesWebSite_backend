import axios from 'axios';
import dotenv from 'dotenv';

import { Titulo } from '../models/tituloInterface';

import { language } from './tituloAux';
import { getMovieCastById, getMovieRuntimeById, getMoviePGRatingById } from './tituloAux';

dotenv.config();

const movieGenreMap = {
    '28': 'Ação',
    '12': 'Aventura',
    '16': 'Animação',
    '35': 'Comédia',
    '80': 'Crime',
    '99': 'Documentário',
    '18': 'Drama',
    '10751': 'Família',
    '14': 'Fantasia',
    '36': 'História',
    '27': 'Terror',
    '10402': 'Música',
    '9648': 'Mistério',
    '10749': 'Romance',
    '878': 'Ficção científica',
    '10770': 'Cinema TV',
    '53': 'Thriller',
    '10752': 'Guerra',
    '37': 'Faroeste'
};

async function getMovieByID(id: number) {
    const response = await axios.get('https://api.themoviedb.org/3/movie/' + id, {
        params: {
            api_key: process.env.TMDB_API_KEY,
            language: language
        }
    });
    
    // Informações da rota de Details
    const { title, release_date, genres, overview, poster_path, backdrop_path } = response.data;
   
    // Informações de outras rotas
    const [cast, runtime, pg] = await Promise.all([
        getMovieCastById(id),
        getMovieRuntimeById(id),
        getMoviePGRatingById(id)
    ]);

    // Mapeia os gêneros pra strings
    const generos = genres.map(genre => movieGenreMap[genre.id.toString()]);

    const movie: Titulo = {
        id: id,
        titulo: title,
        ano: release_date.substring(0, 4),
        duracao: runtime,
        generos: generos,
        classificacao_indicativa: pg,
        sinopse: overview,
        elenco: cast,
        poster_path: poster_path,
        backdrop_path: backdrop_path
    }

    return movie;
}

async function getMoviesByYearAndGenre(year: number | undefined, genre: number | string | undefined) {
    try {
        const params: Record<string, any> = {
            api_key: process.env.TMDB_API_KEY,
            language: language,
            sort_by: 'popularity.desc'
        };

        // Adicione os parâmetros year e genre somente se eles forem definidos
        if (year !== undefined) {
            params.primary_release_year = year;
        }
        if (genre !== undefined) {
            // Mapeia o genero pra o id correspondente
            const genreId = Object.keys(movieGenreMap).find(key => movieGenreMap[key] === genre);
            params.with_genres = genreId;
        }

        const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
            params
        });

        const movies: any[] = [];

        response.data.results.forEach(movie => {
            const titulo = getMovieByID(movie.id);

            if (titulo) {
                movies.push(titulo);
            } else {
                throw new Error('Erro ao buscar título');
            }
        });

        return movies;

    } catch (error) {
        throw error;
    }
}

async function getSimilarMoviesById(id: number) {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/movie/' + id + '/similar', {
            params: {
                api_key: process.env.TMDB_API_KEY,
                language: language
            }
        });

        const movies: any[] = [];

        response.data.results.forEach(movie => {
            const titulo = getMovieByID(movie.id);

            if (titulo) {
                movies.push(titulo);
            } else {
                throw new Error('Erro ao buscar título');
            }
        });

        return movies;

    } catch (error) {
        throw error;
    }
}

export { getMovieByID, getMoviesByYearAndGenre, getSimilarMoviesById };