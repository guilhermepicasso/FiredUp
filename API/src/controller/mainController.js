import multer from "multer";

import { Router } from "express";

import { deletarPorId, deletarTudo, listarPorId, listarTodos } from "../repository/mainRepository.js";
import { alterarModalidade, novaModalidade } from "../repository/modalidadeRepository.js";
import { alterarDisponibilidadeEspaco, alterarEspaco, novoEspaco } from "../repository/espacoRepository.js";
import { alterarItem, alterarQtdDisponivelItem, novoItem } from "../repository/itemRepository.js";

const servidor = Router();

const upload = multer({ dest: 'storage/modalidade' });

servidor.get('/:tipo', async (req, resp) => {
    try {
        const tipo = req.params.tipo;
        const resposta = await listarTodos(tipo);
        resp.status(200).send(resposta);
    } catch (error) {
        resp.status(500).send({ erro: 'Erro interno do servidor.' });
    }
});

servidor.get('/:tipo/:id', async (req, resp) => {
    try {
        const tipo = req.params.tipo;
        const id = req.params.id;
        const resposta = await listarPorId(tipo, id);
        if (resposta) {
            resp.status(200).send(resposta);
        } else {
            resp.status(400).json("Não encontrado")
        }
    } catch (error) {
        resp.status(500).send({ erro: 'Erro interno do servidor.' });
    }
})

servidor.delete('/:tipo/:id', async (req, resp) => {
    try {
        const tipo = req.params.tipo;
        const id = req.params.id;
        await deletarPorId(tipo, id);
        resp.status(200).json("deletado com sucesso!");
    } catch (error) {
        resp.status(500).json({ error: error.message });
    }
})

servidor.delete('/:tipo', async (req, resp) => {
    try {
        const tipo = req.params.tipo;
        const id = req.params.id;
        await deletarTudo(tipo);
        resp.status(200).json("deletado com sucesso!");
    } catch (error) {
        resp.status(500).json({ error: error.message });
    }
})



servidor.post('/:tipo', async (req, resp) => {
    try {
        const tipo = req.params.tipo;
        const body = req.body;
        var resposta = []
        if (tipo == "modalidade") {
            resposta = await novaModalidade(body);
        } else if (tipo == "espaco") {
            resposta = await novoEspaco(body);
        } else if (tipo == "item"){
            resposta = await novoItem(body);
        }
        resp.send(resposta);
    } catch (error) {
        console.error("Erro ao cadastrar: ", error);
        if (error.message === 'O ID do registrador é inválido.') {
            resp.status(400).send({ erro: error.message });
        } else {
            resp.status(500).send({ erro: 'Erro interno do servidor.' });
        }
    }
})

servidor.put('/:tipo/:id', async (req, resp) => {
    try {
        const tipo = req.params.tipo;
        const id = req.params.id;
        const body = req.body;
        var resposta = []
        if (tipo == "modalidade") {
            resposta = await alterarModalidade(id, body);
        } else if (tipo == "espaco") {
            resposta = await alterarEspaco(id, body);
        } else if (tipo == "item") {
            resposta = await alterarItem(id, body);
        } else if (tipo == "retiradaItem") {
            resposta = await alterarQtdDisponivelItem(id, true, body);
        } else if (tipo == "devolucaoItem") {
            resposta = await alterarQtdDisponivelItem(id, false, body);
        } else if (tipo == "disponibilidadeEspaco") {
            resposta = await alterarDisponibilidadeEspaco(id, body);
        }
        resp.send(resposta);
    } catch (error) {
        resp.status(500).send({ erro: 'Erro interno do servidor.' });
    }
})



export default servidor;