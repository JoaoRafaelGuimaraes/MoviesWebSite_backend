import { FastifyRequest, FastifyReply } from 'fastify';
import { auth, admin } from '../firebase/firebaseConfig';

// Interfaces para o body das requisições
import { LoginBody } from '../models/loginBody';
import { RegisterBody } from '../models/registerBody';
import { changePasswordBody } from '../models/changePasswordBody';
import { resetPasswordBody } from '../models/resetPasswordBody';

export const loginEmailAndPassController = async (request: FastifyRequest, reply: FastifyReply) => {
    // Email e senha implementam a interface LoginBody
    const { email, senha } = request.body as LoginBody;

    try {
        // getUserByEmail do Firebase Admin SDK
        const user = await admin.auth().getUserByEmail(email);

        // Se o usuário existir, tenta fazer login
        if (user) {
            try {
                await auth.signInWithEmailAndPassword(email, senha);
                reply.status(200).send({ mensagem: 'Login realizado' });

            } catch (error) {
                reply.status(401).send({ erro: 'Senha incorreta' });  
            }
        }

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        reply.status(500).send({ erro: 'Usuário não cadastrado' });
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

                reply.status(201).send({ mensagem: 'Usuário registrado com sucesso', user });
            }
        }

    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        reply.status(409).send({ erro: 'Email já cadastrado' });
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

export const resetPasswordController = async (request: FastifyRequest, reply: FastifyReply) => {
    const { email } = request.body as resetPasswordBody;

    try {
        const user = await admin.auth().getUserByEmail(email);

        if (user) {
            // Envia email de redefinição de senha
            await auth.sendPasswordResetEmail(email);

            reply.send({ mensagem: 'Email de redefinição de senha enviado com sucesso' });
        } else {
            reply.status(404).send({ erro: 'Usuário não encontrado' });
        }

    } catch (error) {
        console.error('Erro ao enviar email de redefinição de senha:', error);
        reply.status(500).send({ erro: 'Erro ao enviar email de redefinição de senha' });
    }
};

export const changePasswordController = async (request: FastifyRequest, reply: FastifyReply) => {
    const { senhaAtual, novaSenha } = request.body as changePasswordBody;

    try {
        // Obtém o usuário atual
        const user = await auth.currentUser;

        // Verifica se o usuário existe e se seu email é uma string
        if (user && typeof user.email === 'string') {
            try {
                // Verifica se a senha atual está correta
                await auth.signInWithEmailAndPassword(user.email, senhaAtual);

                // Atualiza a senha
                await user.updatePassword(novaSenha);

                reply.status(200).send({ mensagem: 'Senha atualizada com sucesso' });

            } catch (error) {
                reply.status(401).send({ erro: 'Senha atual incorreta' });
            }

        } else {
            reply.status(401).send({ erro: 'Usuário não autenticado ou email inválido' });
        }

    } catch (error) {
        console.error('Erro ao atualizar senha:', error);
        reply.status(500).send({ erro: 'Erro ao atualizar senha' });
    }
};