import { Router } from "express";
import { inserirDisponibilidade } from "../repository/espacoRepository.js";

const servidor = Router();

servidor.post('/disponibilidade/:idEspaco', async (req, resp) => {
    try {
        const idEspaco = req.params.idEspaco;
        const body = req.body;
        let dias = body.diaSemana
        let arrayDias = dias.split('/');
        arrayDias.forEach(async dia => {
            body.diaSemana = dia;
            var resposta = await inserirDisponibilidade(body, idEspaco);
            console.log(resposta);
        });
        resp.send({msg: "Disponibilidade salva com sucesso"});
    } catch (error) {
        console.error("Erro ao cadastrar: ", error);
        if (error.message === 'O ID do registrador é inválido.') {
            resp.status(400).send({ erro: error.message });
        } else {
            resp.status(500).send({ erro: 'Erro interno do servidor.' });
        }
    }
})


export default servidor;