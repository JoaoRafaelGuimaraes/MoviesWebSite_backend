import axios from "axios";
import dotenv from "dotenv";

import { formatMoviesJSON } from "./filmeControllers";
import { genreMap } from "./filmeControllers";

dotenv.config();
const language = "pt-BR";

async function buscaTitulos(nomePesquisado, genero) {
    try {
        const params: { [key: string]: any } = {
            api_key: process.env.TMDB_API_KEY,
            language: language,
            query: nomePesquisado, // query: palavra chave para termo de pesquisa na API TMDB
        };

        // genero && genero verifica se a variavel tem um valor atribuido
        if (genero && genero !== "todos") {
            const genreId = obterIdDoGeneroPeloNome(genero);

            if (genreId) {
                params.with_genres = genreId; //adicionando o ID do genero escolhido como parametro na pesquisa da API
            }
        }

        // depois de verificar se adiciona genero nos parametros ou nao, construa
        //os parametros para a pesquisa
        const response = await axios.get(
            "https://api.themoviedb.org/3/search/movie",
            {
                params: params,
            }
        );

        // formatando os titulos encontrados com a função de filmeControllers
        const titulosEncontrados = formatMoviesJSON(response);

        return titulosEncontrados;
    } catch (error) {
        //sem tratamento de erros...
        throw error;
    }
}

async function obterIdDoGeneroPeloNome(genero) {
    for (const id in genreMap) {
        if (genreMap[id] === genero) {
            return id;
        }
    }
    return null; //caso o genero nao retorne ID, ele nao existe no genreMAP
}
