import { Router } from "express";
import jwt from 'jsonwebtoken';
import { listarPorId } from "../repository/mainRepository.js";
const servidor = Router();

const SECRET_KEY = 'your_secret_key';

servidor.post('//login/', async (req, resp) => {
    const {ra, senha} = req.body;
    console.log(ra, senha);
    const infoUsuario = await listarPorId("usuario", null, ra);
    if (ra === infoUsuario.RA && senha === infoUsuario.RA) {
        const token = jwt.sign( {infoUsuario} , SECRET_KEY, { expiresIn: '1h' });
        resp.status(200).json({ token });
    } else {
        resp.status(500).json({ message: 'Credenciais inválidas' });
    }
});



export default servidor;