import { Filme } from './Filme';
import { Serie } from './Serie';

/*
PERGUNTAR: melhor guardar os objetos dos favoritos ou apenas os ids?
Melhor consultar a memória ou o banco de dados?
*/

export class User {
    email: string;
    pais: string;
    telefone: string;
    filmesFav: Filme[];
    seriesFav: Serie[];
  
    constructor(email: string, pais: string, telefone: string) {
      this.email = email;
      this.pais = pais;
      this.telefone = telefone;
      this.filmesFav = [];
      this.seriesFav = [];
    }

    // Definir o tipo de id quando estivermos familiarizados com a API do TMDB
    adicionarFavorito(id: any) {
        // Verificar se o filme já está na lista de favoritos
        // Adicionar o titulo na lista de favoritos
    }
}