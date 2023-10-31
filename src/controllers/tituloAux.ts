import axios from 'axios';
import dotenv from 'dotenv';

import NodeCache from 'node-cache';
export const cache = new NodeCache({ stdTTL: 900 }); // Cache por 15 min (900s)

dotenv.config();
export const language = 'pt-BR';

async function fetchFromAPI(url: string, params: Record<string, any>) {
    const cacheKey = `${url}:${JSON.stringify(params)}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await axios.get(url, {
            params
        });

        cache.set(cacheKey, response.data);
        return response.data;

    } catch (error) {
        throw error;
    }
}

async function getMovieCastById(id: number) {
    try {
        const data = await fetchFromAPI('https://api.themoviedb.org/3/movie/' + id + '/credits', {
            api_key: process.env.TMDB_API_KEY,
            language: language
        });

        const elenco = data.cast.slice(0, 4).map((ator) => ator.name);

        return elenco;

    } catch (error) {
        throw error;
    }
}

async function getMovieRuntimeById(id: number) {
    try {
        const data = await fetchFromAPI('https://api.themoviedb.org/3/movie/' + id, {
            api_key: process.env.TMDB_API_KEY,
            language: language
        });

        return data.runtime;

    } catch (error) {
        throw error;
    }
}

async function getMoviePGRatingById(id: number) {
    try {
        const data = await fetchFromAPI('https://api.themoviedb.org/3/movie/' + id + '/release_dates', {
            api_key: process.env.TMDB_API_KEY,
            language: language
        });

        // Tenta encontrar a classificação indicativa para o Brasil
        const certificationBR = data.results?.find((result) => result.iso_3166_1 === 'BR')?.release_dates?.[0]?.certification;

        // Se encontrou a classificação para o Brasil, retorna. Caso contrário, retorna a primeira da lista.
        return certificationBR || data.results?.[0]?.release_dates?.[0]?.certification;

    } catch (error) {
        throw error;
    }
}

// SÉRIES AUX ---------------------------------------------------------------------------------------------------------------

async function getSerieCastById(id: number) {
    try {
        const data = await fetchFromAPI('https://api.themoviedb.org/3/tv/' + id + '/credits', {
            api_key: process.env.TMDB_API_KEY,
            language: language
        });

        const elenco = data.cast.slice(0, 4).map((ator) => ator.name);

        return elenco;

    } catch (error) {
        throw error;
    }
}

async function getSerieNumSeasonsById(id: number) {
    try {
        const data = await fetchFromAPI('https://api.themoviedb.org/3/tv/' + id, {
            api_key: process.env.TMDB_API_KEY,
            language: language
        });

        return data.number_of_seasons;

    } catch (error) {
        throw error;
    }
}

async function getSeriePGRatingById(id: number) {
    try {
        const data = await fetchFromAPI('https://api.themoviedb.org/3/tv/' + id + '/content_ratings', {
            api_key: process.env.TMDB_API_KEY,
            language: language,
        });

        if (data.results && data.results.length > 0) {
            // Tenta encontrar a classificação indicativa para o Brasil
            const certification = data.results.find((result) => result.iso_3166_1 === 'BR');

            if (certification) {
                return certification.rating;
            }

            // Se não encontrou a classificação para o Brasil, retorna a primeira da lista
            return data.results[0].rating;
        }

    } catch (error) {
        throw error;
    }
}

export { fetchFromAPI, getMovieCastById, getMovieRuntimeById, getMoviePGRatingById,
    getSerieCastById, getSerieNumSeasonsById, getSeriePGRatingById };