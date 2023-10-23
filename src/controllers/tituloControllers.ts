import { getMoviesByYear, getMoviesByYearAndGenre, getMovieByID } from "./filmeControllers";
import { getSeriesByYear, getSeriesByYearAndGenre, getSerieByID } from "./serieControllers";

import { Titulo } from "../models/tituloInterface";


async function getMediaType(mediaID: any)
{
    try{
        const movie = await getMovieByID(mediaID)
        return movie;
    }catch(error){
        if (error.response && error.response.status === 404) {
            try{
                const serie = await getSerieByID(mediaID)
                return serie
            }catch(tverror){
                console.error('MediaID não encontrado!')
                return 'Título não encontrado';
            }
        }
    }

}

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

export { getTitulosByYear, getTitulosByYearAndGenre, getMediaType };