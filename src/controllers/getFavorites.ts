import { FastifyRequest, FastifyReply } from 'fastify';
import { auth, admin } from '../firebase/firebaseConfig';
import { getMediaType } from './tituloControllers';
import { getMovieByID } from './filmeControllers';
import { getSerieByID } from './serieControllers';
import { Titulo } from "../models/tituloInterface";


export const getFavorites = async (request: FastifyRequest, reply: FastifyReply) => {

    const user = await auth.currentUser; //Identifica o usuário corrente

    if (user){

        const identificador = user.uid
        const User_Collection = admin.firestore().collection('usuarios/'+identificador+'/favoritos')
        const User_Fav = await User_Collection.get()
        

        if (!User_Fav.empty) {
            const favoritosData = User_Fav.docs.map(doc => doc.data().id);

            const my_array = await Promise.all(favoritosData.map(id => getMediaType(id)));


            reply.status(200).send(my_array);
        } else {
            console.error('Nenhum documento encontrado nos favoritos');
            reply.status(404).send({ error: 'Nenhum documento encontrado nos favoritos' });
        }



    }else{ //Usuário não está logado

        console.error('Nenhum usuário logado');
        reply.status(500).send({ erro: 'Nenhum usuário logado' });
    }

}

