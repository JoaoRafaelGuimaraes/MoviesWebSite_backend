import axios from 'axios';
import dotenv from 'dotenv';

import { Titulo } from '../models/tituloInterface';

dotenv.config();
const language = 'pt-BR'

const genreMap = {
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



async function getSerieByID (serieID: any){

    try {
        const response = await axios.get('https://api.themoviedb.org/3/tv/' + serieID, {
            params: {
                api_key: process.env.TMDB_API_KEY,
                language: language
            }
        });

        const movies = await formatAserie(response);
        return movies;
    } catch (error) {
        throw error;
    }
}

async function getCastSerieById(id: number) {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/tv/' + id + '/credits', {
            params: {
                api_key: process.env.TMDB_API_KEY,
                language: language
            }
        });

        const elenco = response.data.cast.slice(0, 4).map((ator) => ator.name);;

        return elenco;
        
    } catch (error) {
        throw error;
    }
}

async function getNumSeasonsById(id: number) {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/tv/' + id, {
            params: {
                api_key: process.env.TMDB_API_KEY,
                language: language
            }
        });

        const numSeasons = response.data.number_of_seasons;

        return numSeasons;
        
    } catch (error) {
        throw error;
    }
}

async function getPGRatingById(id: number) {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/tv/' + id + '/content_ratings', {
          params: {
            api_key: process.env.TMDB_API_KEY,
            language: language,
          }
        });
    
        if (response.data.results && response.data.results.length > 0) {
          // Tenta encontrar a classificação indicativa para o Brasil
          const certification = response.data.results.find((result) => result.iso_3166_1 === 'BR');
    
          if (certification) {
            return certification.rating;
          }
        }
    
        // Se não encontrou a classificação para o Brasil, retorna a primeira da lista
        const firstCertification = response.data.results[0];

        if (firstCertification && firstCertification.rating) {
            return firstCertification.rating;
        }
    
      } catch (error) {
        throw error;
      }
  }


  async function formatAserie(response){
    
    const serieData = response.data
    
    
    const { id, name, first_air_date, genres, overview, poster_path, backdrop_path } = serieData;

        const elenco = await getCastSerieById(id);
        const numSeasons = await getNumSeasonsById(id);
        const pg = await getPGRatingById(id);

        const temp = numSeasons > 1 ? ' temporadas' : ' temporada';

        const serieFormatada: Titulo = {
            id: id,
            titulo: name,
            ano: first_air_date.slice(0, 4),
            duracao: numSeasons + temp,
            generos: genres.map(genre => genreMap[genre.id.toString()]),
            classificacao_indicativa: pg,
            sinopse: overview,
            elenco: elenco,
            poster_path: poster_path,
            backdrop_path: backdrop_path
        };

        return serieFormatada;
}


async function formatSeriesJSON(response) {
    const seriesData = response.data.results;

    const series: Titulo[] = await Promise.all(seriesData.map(async (serieData) => {
        const { id, name, first_air_date, genre_ids, overview, poster_path, backdrop_path } = serieData;

        const elenco = await getCastSerieById(id);
        const numSeasons = await getNumSeasonsById(id);
        const pg = await getPGRatingById(id);

        const temp = numSeasons > 1 ? ' temporadas' : ' temporada';

        const serieFormatada: Titulo = {
            id: id,
            titulo: name,
            ano: first_air_date.slice(0, 4),
            duracao: numSeasons + temp,
            generos: genre_ids.map((genre) => genreMap[genre]),
            classificacao_indicativa: pg,
            sinopse: overview,
            elenco: elenco,
            poster_path: poster_path,
            backdrop_path: backdrop_path
        };

        return serieFormatada;
    }));

    return series;
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
    
        const series = await formatSeriesJSON(response);

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
            with_genres: genre
          }
        });
    
        const series = await formatSeriesJSON(response);

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

        const series = await formatSeriesJSON(response);

        return series;

    } catch (error) {
        throw error;
    }
}

// Extra ------------------------------------------------------------------------

async function getAllSeriesGenres() {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/genre/tv/list', {
            params: {
                api_key: process.env.TMDB_API_KEY,
                language: language
            }
        });
        
        const genres = response.data.genres;

        return genres;

    } catch (error) {
        throw error;
    }
}

export { getSeriesByYear, getSeriesByYearAndGenre, getSimilarSeriesById, getSerieByID, getCastSerieById, getNumSeasonsById};