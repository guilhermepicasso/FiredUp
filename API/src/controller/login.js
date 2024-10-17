import { Router } from "express";
import jwt from 'jsonwebtoken';
// import { exibirUsuario } from "../repository/userRepository.js";
import { listarPorId } from "../repository/mainRepository.js";
const servidor = Router();

const SECRET_KEY = 'your_secret_key';

servidor.post('/login', async (req, resp) => {
    const {ra, senha} = req.body;
    const infoUsuario = await listarPorId(ra)("usuario", null, ra);
    if (infoUsuario.length > 0) {
        if (ra === infoUsuario[0].RA && senha === infoUsuario[0].RA) {
            const token = jwt.sign( {infoUsuario} , SECRET_KEY, { expiresIn: '1h' });
            resp.status(200).json({ token });
        } else {
            resp.status(500).json({ message: 'Credenciais inválidas' });
        }
    } else{
        resp.status(500).json({ message: 'Credenciais inválidas' });
    }
});

export default servidor;