import * as filmeControllers from './filmeControllers';

filmeControllers.getGenres()
    .then((genres) => {
        // Obtem o id do gênero pelo nome
        const genreId = genres.find((genre) => genre.name === 'Comédia').id;
    })
    .catch((error) => {
        console.error('Erro ao buscar categorias de filmes:', error);
    });

filmeControllers.getMoviesByGenre('Comédia')
    .then((movies) => {
        console.log('Filmes de comédia:', movies);
    })
    .catch((error) => {
        console.error('Erro ao buscar filmes:', error);
    });

