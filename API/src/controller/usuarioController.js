import { exibirUsuario, exibirUsuarios, listarTimesUsuario } from "../repository/userRepository.js";

import { Router } from "express";
let servidor = Router();

servidor.get('/timesusuario/:id', async (req, resp) => {
    try {
        const id = req.params.id;
        let times = await listarTimesUsuario(id);
        resp.status(200).json(times);
    } catch (error) {
        resp.status(500).json("Erro ao buscar times do usuario" + error);
    }
})

export default servidor;