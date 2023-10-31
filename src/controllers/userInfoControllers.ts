import { FastifyRequest, FastifyReply } from 'fastify';
import { auth, admin } from '../firebase/firebaseConfig';

import { EmailAuthProvider } from 'firebase/auth';

//Importa interface
import { RegisterBody } from '../models/registerBody';
import { changeEmailBody } from '../models/changeEmailBody';

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
        reply.status(401).send({ erro: 'Nenhum usuário logado' });
    }
}

export const changeEmailController = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const user = auth.currentUser;

        if (!user) {
            reply.status(401).send({ erro: 'Usuário não autenticado' });
            return;
        }

        if (typeof user.email !== 'string') {
            reply.status(400).send({ erro: 'O usuário autenticado não possui um email válido' });
            return;
        }

        const isGoogleUser = user.providerData.some((userInfo) => {
            return userInfo && userInfo.providerId === 'google.com';
        });
        
        const isFacebookUser = user.providerData.some((userInfo) => {
            return userInfo && userInfo.providerId === 'facebook.com';
        });

        if (isGoogleUser || isFacebookUser) {
            reply.status(400).send({ erro: 'Não é possível alterar o email de usuários que se registraram com o Google ou Facebook' });
            return;
        }

        const { novoEmail, senha } = request.body as changeEmailBody;

        try {
            // Para mudar o email, o usuário deve reautenticar
            const credentials = EmailAuthProvider.credential(user.email, senha);

            // Reautentique o usuário
            await user.reauthenticateWithCredential(credentials);

            // Atualiza o email 
            await admin.auth().updateUser(user.uid, { email: novoEmail });

            // Muda o email no banco de dados
            const usersCollection = admin.firestore().collection('usuarios');
            const userDocument = await usersCollection.doc(user.uid).get();
            await userDocument.ref.update({ email: novoEmail });

            reply.status(200).send({ mensagem: 'Email alterado' });

        } catch (error) {
            console.error('Erro ao alterar email:', error);
            reply.status(500).send({ erro: 'Erro ao alterar email' });
        }

    } catch (error) {
        console.error('Erro ao alterar email:', error);
        reply.status(500).send({ erro: 'Erro ao alterar email' });
    }
}