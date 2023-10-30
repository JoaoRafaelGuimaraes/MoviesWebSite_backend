import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
export const language = 'pt-BR';

export const API_KEY = '7766f2e523b15ac0e4017299de45c9c8';

async function getMovieCastById(id: number) {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/movie/' + id + '/credits', {
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

async function getMovieRuntimeById(id: number) {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/movie/' + id, {
            params: {
                api_key: process.env.TMDB_API_KEY,
                language: language
            }
        });

        const runtime = response.data.runtime;

        return runtime;
        
    } catch (error) {
        throw error;
    }
}

async function getMoviePGRatingById(id: number) {
    try {
      const response = await axios.get('https://api.themoviedb.org/3/movie/' + id + '/release_dates', {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: language,
        }
      });
  
      if (response.data.results && response.data.results.length > 0) {
        // Tenta encontrar a classificação indicativa para o Brasil
        const certification = response.data.results.find((result) => result.iso_3166_1 === 'BR');
  
        if (certification) {
          return certification.release_dates[0].certification;;
        }
      }
  
      // Se não encontrou a classificação para o Brasil, retorna a primeira da lista
      const firstCertification = response.data.results[0];
      
      if (firstCertification && firstCertification.release_dates && firstCertification.release_dates.length > 0) {
        return firstCertification.release_dates[0].certification;
      }
  
    } catch (error) {
      throw error;
    }
}

// SÉRIES AUX ---------------------------------------------------------------------------------------------------------------

async function getSerieCastById(id: number) {
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

async function getSerieNumSeasonsById(id: number) {
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

async function getSeriePGRatingById(id: number) {
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

export { getMovieCastById, getMovieRuntimeById, getMoviePGRatingById,
    getSerieCastById, getSerieNumSeasonsById, getSeriePGRatingById };