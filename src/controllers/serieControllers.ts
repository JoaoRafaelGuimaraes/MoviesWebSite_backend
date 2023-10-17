import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const language = 'pt-BR'

export async function getGenres() {
        try {
                const response = await axios.get('https://api.themoviedb.org/3/genre/tv/list', {
                    params: {
                        api_key: process.env.TMDB_API_KEY,
                        language: language
                    },
                });
        
                const genres = response.data.genres;

                return genres;

            } catch (error) {
                throw error;
            }
}

export async function getSeriesByGenre(genre: number | string) {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/discover/tv', {
          params: {
            api_key: process.env.TMDB_API_KEY,
            language: language,
            with_genres: genre
          },
        });
    
        const movies = response.data.results;

        return movies;

      } catch (error) {
        throw error;
      }
}

export async function getTitlesByYear(ano: number) {
    
}