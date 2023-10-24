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

//Função adicionada: retornar apenas uma string que indica se é um filme ou série
//diferente de getMediaType que retorna todos os detalhes de um titulo, dificultando
//para pegar apenas o tipo de midia do titulo // coloquei tv ao invés de serie por causa da API TMDB
async function isMovieOrSerie(idTitulo: number): Promise<string> {
    try {
        await getMovieByID(idTitulo);
        return "movie"; //se encontrar com esse ID nessa função, é um filme!
    } catch (error) {
        if (error.response && error.response.status === 404) {
            // se retornar 404, not found, pode ser uma série
            try {
                await getSerieByID(idTitulo);
                return "tv"; // se der certo na função de pegar série, é uma série
            } catch (tverror) {
                return "not found"; //se nenhuma das duas der certo, não é filme nem série, nem exite
            }
        } else {
            throw error; //para erros diferentes do Not Found
        }
    }
}


export { getTitulosByYear, getTitulosByYearAndGenre, getMediaType, isMovieOrSerie };