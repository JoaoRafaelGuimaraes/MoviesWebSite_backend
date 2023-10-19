/*

Home:
    - Sem filtro: Filmes e Séries mais populares intercalados separados por ano
(1) getTitlesByYear(ano: number)
    - Com filtro: Filmes e Séries mais populares de um gênero intercalados separados por ano
(2) getTitlesByYearAndGenre(ano: number, genre: number | string)

Filmes:
    - Sem filtro: Filmes mais populares separados por ano
(3) getMoviesByYear(ano: number)
    - Com filtro: Filmes mais populares de um gênero separados por ano
(4) getMoviesByYearAndGenre(ano: number, genre: number | string)

Séries:
    - Sem filtro: Séries mais populares separadas por ano
(5) getSeriesByYear(ano: number)
    - Com filtro: Séries mais populares de um gênero separadas por ano
(6) getSeriesByYearAndGenre(ano: number, genre: number | string)


É possivel fazer uma única função a partir da função getXByYearAndGenre se colocarmos o gênero como null por padrão,
dessa forma ela age como a função getXByYear, mas por motivos de organização e legibilidade, preferi deixar separado.

*/

import axios from "axios";
import dotenv from "dotenv";

import { Titulo } from "../models/tituloInterface";

dotenv.config();
const language = "pt-BR";

export const genreMap = {
    "28": "Ação",
    "12": "Aventura",
    "16": "Animação",
    "35": "Comédia",
    "80": "Crime",
    "99": "Documentário",
    "18": "Drama",
    "10751": "Família",
    "14": "Fantasia",
    "36": "História",
    "27": "Terror",
    "10402": "Música",
    "9648": "Mistério",
    "10749": "Romance",
    "878": "Ficção científica",
    "10770": "Cinema TV",
    "53": "Thriller",
    "10752": "Guerra",
    "37": "Faroeste",
};

async function getCastById(id: number) {
    try {
        const response = await axios.get(
            "https://api.themoviedb.org/3/movie/" + id + "/credits",
            {
                params: {
                    api_key: process.env.TMDB_API_KEY,
                    language: language,
                },
            }
        );

        const elenco = response.data.cast.slice(0, 4).map((ator) => ator.name);

        return elenco;
    } catch (error) {
        throw error;
    }
}

async function getRuntimeById(id: number) {
    try {
        const response = await axios.get(
            "https://api.themoviedb.org/3/movie/" + id,
            {
                params: {
                    api_key: process.env.TMDB_API_KEY,
                    language: language,
                },
            }
        );

        const runtime = response.data.runtime;

        return runtime;
    } catch (error) {
        throw error;
    }
}

async function getPGRatingById(id: number) {
    try {
        const response = await axios.get(
            "https://api.themoviedb.org/3/movie/" + id + "/release_dates",
            {
                params: {
                    api_key: process.env.TMDB_API_KEY,
                    language: language,
                },
            }
        );

        if (response.data.results && response.data.results.length > 0) {
            // Tenta encontrar a classificação indicativa para o Brasil
            const certification = response.data.results.find(
                (result) => result.iso_3166_1 === "BR"
            );

            if (certification) {
                return certification.release_dates[0].certification;
            }
        }

        // Se não encontrou a classificação para o Brasil, retorna a primeira da lista
        const firstCertification = response.data.results[0];

        if (
            firstCertification &&
            firstCertification.release_dates &&
            firstCertification.release_dates.length > 0
        ) {
            return firstCertification.release_dates[0].certification;
        }
    } catch (error) {
        throw error;
    }
}

async function formatMoviesJSON(response) {
    const filmesData = response.data.results;
    const filmesFormatados: Titulo[] = await Promise.all(
        filmesData.map(async (filmeData) => {
            const {
                id,
                title,
                release_date,
                genre_ids,
                overview,
                poster_path,
            } = filmeData;

            const [cast, runtime, pg] = await Promise.all([
                getCastById(id),
                getRuntimeById(id),
                getPGRatingById(id),
            ]);

            const generos = genre_ids.map((genre_id) => genreMap[genre_id]);

            const filmeFormatado: Titulo = {
                id: id,
                titulo: title,
                ano: release_date.substring(0, 4),
                duracao: runtime + " min",
                generos: generos,
                classificacao_indicativa: pg,
                sinopse: overview,
                elenco: cast,
                path_poster: poster_path,
            };

            return filmeFormatado;
        })
    );

    return filmesFormatados;
}

async function getMoviesByYear(ano: number) {
    try {
        const response = await axios.get(
            "https://api.themoviedb.org/3/discover/movie",
            {
                params: {
                    api_key: process.env.TMDB_API_KEY,
                    language: language,
                    primary_release_year: ano,
                    sort_by: "popularity.desc",
                },
            }
        );

        const movies = await formatMoviesJSON(response);

        return movies;
    } catch (error) {
        throw error;
    }
}

async function getMoviesByYearAndGenre(year: number, genre: number | string) {
    try {
        const response = await axios.get(
            "https://api.themoviedb.org/3/discover/movie",
            {
                params: {
                    api_key: process.env.TMDB_API_KEY,
                    language: language,
                    primary_release_year: year,
                    with_genres: genre,
                },
            }
        );

        const movies = await formatMoviesJSON(response);

        return movies;
    } catch (error) {
        throw error;
    }
}

// Extra ------------------------------------------------------------------------

async function getAllMovieGenres() {
    try {
        const response = await axios.get(
            "https://api.themoviedb.org/3/genre/movie/list",
            {
                params: {
                    api_key: process.env.TMDB_API_KEY,
                    language: language,
                },
            }
        );

        const genres = response.data.genres;

        return genres;
    } catch (error) {
        throw error;
    }
}

export { getMoviesByYear, getMoviesByYearAndGenre, formatMoviesJSON };
