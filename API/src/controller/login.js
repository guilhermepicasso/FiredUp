import { Router } from "express";
import jwt from 'jsonwebtoken';
import { listarPorId } from "../repository/mainRepository.js";
const servidor = Router();

const SECRET_KEY = 'your_secret_key';

servidor.post('/login/', async (req, resp) => {
    const body = req.body;
    const infoUsuario = await listarPorId("usuario", null, body.ra);
    
    // Verificação do tipo de retorno e conteúdo de infoUsuario
    if (infoUsuario === 'Usuário não encontrado') {
        resp.status(404).json({ message: 'Usuário inválido!' });
    } else {
        if (infoUsuario.nome === body.senha) {
            const token = jwt.sign({ infoUsuario }, SECRET_KEY, { expiresIn: '1h' });
            resp.status(200).json({ token });
        } else {
            resp.status(401).json({ message: 'Senha inválida!' });
        }
    }
});

servidor.post('/login/admin/', async (req, resp) => {
    const body = req.body;
    const infoUsuario = await listarPorId("admin", null, body.ra);
    
    // Verificação do tipo de retorno e conteúdo de infoUsuario
    if (infoUsuario === 'Usuário não encontrado') {
        resp.status(404).json({ message: 'Usuário inválido!' });
    } else {
        if (infoUsuario.nome === body.senha) {
            const token = jwt.sign({ infoUsuario }, SECRET_KEY, { expiresIn: '1h' });
            resp.status(200).json({ token });
        } else {
            resp.status(401).json({ message: 'Senha inválida!' });
        }
    }
});


export default servidor;