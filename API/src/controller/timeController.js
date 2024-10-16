import { Router } from "express";
const servidor = Router();

import { alterarTime, deletarTime, listarTime, listarTimes, novoTime } from "../repository/timeRepository.js";
import { deletarParticipante, listarParticipantesPorTime } from "../repository/participanteRepository.js";

servidor.post('/time', async (req, resp) => {
    try {
        const time = req.body;
        const timeCriado = await novoTime(time);
        resp.status(200).send(timeCriado);
    } catch (error) {
        console.error("Erro ao cadastrar: ", error);
        if (error.message === 'O ID do registrador é inválido.') {
            resp.status(400).send({ erro: error.message });
        } else {
            resp.status(500).send({ erro: 'Erro interno do servidor.' });
        }
    }
})

servidor.get('/time', async (req, resp) => {
    try {
        const listaTimes = await listarTimes();
        resp.status(200).send(listaTimes);
    } catch (error) {
        resp.status(500).send({ erro: 'Erro interno do servidor.' });
    }
});

servidor.get('/time/:id', async (req, resp) => {
    const id = req.params.id;
    const listaTime = await listarTime(id);
    resp.send(listaTime);
})

servidor.put('/time/:id', async (req, resp) => {
    try {
        const time = req.body;
        const id = req.params.id;
        const timeAlterado = await alterarTime(id, time);
        resp.status(200).send(timeAlterado);
    } catch (error) {
        resp.status(500).send({ erro: 'Erro interno do servidor.' });
    }
})

servidor.delete('/time/:id', async (req, resp) => {
    try {
        const id = req.params.id;
        const participantes = await listarParticipantesPorTime(id);
        participantes.forEach(async participante => {
            await deletarParticipante(participante.id);
        });
        await deletarTime(id);
        resp.status(200).json("Time deletado com sucesso!");
    } catch (error) {
        resp.status(500).json({ error: error.message });
    }
})

export default servidor;