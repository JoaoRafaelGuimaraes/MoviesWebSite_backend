import { getMoviesByYear, getMoviesByYearAndGenre } from "./filmeControllers";
import { getSeriesByYear, getSeriesByYearAndGenre } from "./serieControllers";

import { Titulo } from "../models/tituloInterface";

async function getTitulosByYear(ano: number) {
    try {
        // Use Promise.all para buscar filmes e séries simultaneamente
        const [movies, series] = await Promise.all([getMoviesByYear(ano), getSeriesByYear(ano)]);

        const intercalados: Titulo[] = [];

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

async function getTitulosByYearAndGenre(ano: number, genre: number | string) {
    try {
        const [movies, series] = await Promise.all([getMoviesByYearAndGenre(ano, genre), getSeriesByYearAndGenre(ano, genre)]);

        const intercalados: Titulo[] = [];

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
