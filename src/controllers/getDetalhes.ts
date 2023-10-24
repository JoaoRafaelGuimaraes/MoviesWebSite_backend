import axios from "axios";
import { isMovieOrSerie } from "./tituloControllers";
import { getCastById, getRuntimeById } from "./filmeControllers";
import { getCastSerieById, getNumSeasonsById } from "./serieControllers";
const language = "pt-BR";

async function obterDetalhesTitulo(idTitulo: number) {
    const mediaType = await isMovieOrSerie(idTitulo); //verificando que tipo de midia é esse ID

    if (mediaType === "movie") {
        try {
            const response = await axios.get(
                `https://api.themoviedb.org/3/movie/${idTitulo}`,
                {
                    params: {
                        api_key: process.env.TMDB_API_KEY,
                        language: language,
                    },
                }
            );

            //dados do titulo retornados pela API na chamada
            const dadosFilme = response.data;

            //utilizando os dados do filme para puxar informações necessárias
            const elenco = await getCastById(idTitulo);
            const duracao = await getRuntimeById(idTitulo);
            const sinopse = dadosFilme.overview;
            const dataLancamento = dadosFilme.release_date;

            //chamada à api para pegar o poster do filme, utilizando a variavel que guardou a response
            const capaFilme = `https://image.tmdb.org/t/p/w500${dadosFilme.poster_path}`;

            //armazenando todas as informações em um objeto para retorna-lo na chamada da função
            const detalhesFilme = {
                capa: capaFilme,
                dataLancamento: dataLancamento,
                elenco: elenco,
                duracao: duracao,
                sinopse: sinopse,
            };

            return detalhesFilme;
        } catch (error) {
            throw error;
        }
    } else if (mediaType === "tv") {
        try {
            const response = await axios.get(
                `https://api.themoviedb.org/3/tv/${idTitulo}`,
                {
                    params: {
                        api_key: process.env.TMDB_API_KEY,
                        language: language,
                    },
                }
            );

            //dados do titulo retornados pela API na chamada
            const dadosSerie = response.data;

            //utilizando os dados da serie para puxar informações necessárias
            const sinopse = dadosSerie.overview;
            const dataLancamento = dadosSerie.release_date;
            const elenco = await getCastSerieById(idTitulo);
            const duracao = await getNumSeasonsById(idTitulo);
            const capaSerie = `https://image.tmdb.org/t/p/w500${dadosSerie.poster_path}`;

            const detalhesSerie = {
                capa: capaSerie,
                dataLancamento: dataLancamento,
                elenco: elenco,
                duracao: duracao,
                sinopse: sinopse,
            };

            return detalhesSerie;
        } catch (error) {
            throw error;
        }
    } else {
    /*titulo nao encontrado*/
        console.log("Titulo nao encontrado");
    }
}
