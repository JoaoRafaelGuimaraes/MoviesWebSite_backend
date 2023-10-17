import { FastifyRequest, FastifyReply } from 'fastify';
import { auth, admin } from '../firebase/firebaseConfig';

//Importa interface
import { RegisterBody } from '../models/registerBody';


export const getUserInfo = async (request: FastifyRequest, reply: FastifyReply) => {
    //Retorna informações do usuário

    const user = await auth.currentUser;
    
    
    
    if (user) {
        
        const user_record = {

            email: user.email,
            nome: user.displayName,
            telefone: user.phoneNumber,
            id: user.uid
        }

        const user_json = JSON.stringify(user_record)

        console.log(`Successfully fetched user data: `, user_json)

        reply.status(200).send(user_json);

    
    } else { //Nenhum usuário logado
 
        console.error('Nenhum usuário logado');
        reply.status(500).send({ erro: 'Nenhum usuário logado' });
    }


}