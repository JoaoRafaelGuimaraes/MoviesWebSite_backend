import { FastifyRequest, FastifyReply } from 'fastify';
import { auth, admin } from '../firebase/firebaseConfig';

// Interfaces para o body das requisições
import { LoginBody } from '../models/loginBody';
import { RegisterBody } from '../models/registerBody';

export const loginEmailAndPassController = async (request: FastifyRequest, reply: FastifyReply) => {
    // Email e senha implementam a interface LoginBody
    const { email, senha } = request.body as LoginBody;

    try {
        // getUserByEmail do Firebase Admin SDK
        const user = await admin.auth().getUserByEmail(email);

        // Se o usuário existir, tenta fazer login
        if (user) {
            await auth.signInWithEmailAndPassword(email, senha);
            reply.send({ mensagem: 'Login realizado' });
        } else {
            reply.status(401).send({ erro: 'Senha incorreta' });
        }
    
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        reply.status(500).send({ erro: 'Erro ao fazer login' });
    }

};

export const registerEmailAndPassController = async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, senha, nome, telefone } = request.body as RegisterBody;

    try {
        // Cria o usuário com o auth.createUser
        const userRecord = await auth.createUserWithEmailAndPassword(email, senha);
        
        if (userRecord) {
            const user = userRecord.user;

            // Verifica se 'user' não é nulo antes de acessar suas propriedades
            if (user) {
                // Usa o UID do usuário para criar um documento na coleção 'usuarios' no Firestore Database
                const usuarioData = {
                    uid: user.uid,
                    nome,
                    email,
                    telefone,
                };

                // Envia email de confirmação
                await user.sendEmailVerification();

                const usuarioRef = admin.firestore().collection('usuarios').doc(user.uid);
                await usuarioRef.set(usuarioData);

                reply.send({ mensagem: 'Usuário registrado com sucesso', user });
            } else {
                // 'user' é nulo
                reply.status(500).send({ erro: 'Usuário não criado corretamente' });
            }
        } else {
            // 'userRecord' é nulo
            reply.status(500).send({ erro: 'Erro ao registrar usuário' });
        }

    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        reply.status(500).send({ erro: 'Erro ao registrar usuário' });
    }
};

export const logoutController = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        await auth.signOut();
        reply.send({ mensagem: 'Logout realizado' });
        
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        reply.status(500).send({ erro: 'Erro ao fazer logout' });
    }
};