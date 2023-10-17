import { FastifyRequest, FastifyReply } from 'fastify';
import { auth, admin } from '../firebase/firebaseConfig';

//Importa interface
import { RegisterBody } from '../models/registerBody';


export const getUserInfo = async (request: FastifyRequest, reply: FastifyReply) => {
    //Retorna informações do usuário

    const user = await auth.currentUser;
    
    
    
    if (user) {
        
        const usersCollection = admin.firestore().collection('usuarios');


        const userDocument = await usersCollection.doc(user.uid).get();

    

        console.log(`Successfully fetched user data: `, userDocument.data())

        reply.status(200).send(userDocument.data());

    
    } else { //Nenhum usuário logado
 
        console.error('Nenhum usuário logado');
        reply.status(500).send({ erro: 'Nenhum usuário logado' });
    }


}