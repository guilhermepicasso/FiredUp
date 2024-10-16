import { Router } from "express";
import { buscarParticipante, deletarParticipante, listarParticipantes, listarParticipantesPorTime, listarTimesPorParticipante, novoParticipante } from "../repository/participanteRepository.js";
import { alterarParticipantes, listarTime } from "../repository/timeRepository.js";
const servidor = Router();

servidor.get('/participante/', async (req, resp) => {
    try {
        const listaTimes = await listarParticipantes();
        resp.status(200).send(listaTimes);
    } catch (error) {
        resp.status(500).send({ erro: 'Erro interno do servidor.' });
    }
});

servidor.get('/participante/time/:id', async (req, resp) => {
    try {
        const id = req.params.id;
        const listaTimes = await listarParticipantesPorTime(id);
        resp.status(200).send(listaTimes);
    } catch (error) {
        resp.status(500).send({ erro: 'Erro interno do servidor.' });
    }
});

servidor.get('/participante/usuario/:id', async (req, resp) => {
    try {
        const id = req.params.id;
        const listaTimes = await listarTimesPorParticipante(id);
        resp.status(200).send(listaTimes);
    } catch (error) {
        resp.status(500).send({ erro: 'Erro interno do servidor.' });
    }
});

servidor.post('/participante', async (req, resp) => {
    try {
        const participante = req.body;
        const infoTime = await listarTime(participante.time);
        if (infoTime[0].registrador_id !== participante.usuario) {
            if (infoTime[0].participantes_atual < infoTime[0].max_participantes ) {
                const participanteCriado = await novoParticipante(participante);
                if (participanteCriado) { 
                    await alterarParticipantes(participanteCriado.time, infoTime[0].participantes_atual + 1);
                    return resp.status(200).json("Agora você faz parte desse time!");
                } else {
                    resp.status(500).json("Erro ao criar participante.");
                }
            } else {
                resp.status(400).json("Quantidade máxima de participantes atingida!");
            }
        } else {
            resp.status(400).json("Você é o criador do time então não pode se registrar nele.");
        }
    } catch (error) {
        if (error.message === 'PARTICIPANTE_JA_EXISTE') {
            resp.status(409).json({ message: 'Você já participa deste time!' });
        } else {
            resp.status(500).json({ message: 'Erro interno do servidor', error: error.message });
        }
    }
});

servidor.delete('/participante/:id', async (req, resp) => {
    try {
        const id = req.params.id;
        await deletarParticipante(id);
        resp.status(200).json("Você saiu da partida!");
    } catch (error) {
        console.error(error);
        if (error.message.includes('Quantidade de participantes é 0')) {
            resp.status(400).json(error.message);
        } else {
            resp.status(500).json("Erro ao tentar sair da partida! Tente novamente mais tarde!");
        }
    }
});


export default servidor;