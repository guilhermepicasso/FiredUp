import multer from "multer";

import { Router } from "express";

import { alterar, criar, deletarPorId, deletarTudo, listarPorId, listarTodos } from "../repository/mainRepository.js";
import { alterarQtdDisponivelItem } from "../repository/itemRepository.js";

const servidor = Router();

const upload = multer({ dest: 'storage/modalidade' });

servidor.post('/:tabela', async (req, resp) => {
    try {
        const tabela = req.params.tabela;
        const body = req.body;
        var resposta = await criar(tabela, body);
        if (resposta.length === 0) {
            resp.status(400).send({erro: "Erro ao inserir na tabela " + tabela});
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

servidor.get('/:tipo', async (req, resp) => {
    try {
        const tipo = req.params.tipo;
        const resposta = await listarTodos(tipo);
        resp.status(200).send(resposta);
    } catch (error) {
        resp.status(500).send({ erro: 'Erro interno do servidor.' });
    }
});

servidor.get('/:tabela/:busca/:id', async (req, resp) => {
    try {
        const tabela = req.params.tabela;
        const busca = req.params.busca;
        const id = req.params.id;
        const resposta = await listarPorId(tabela, busca, id);
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

        // Exclui diretamente o registro da tabela principal
        await deletarPorId(tipo, id);  // O CASCADE cuidará dos relacionamentos

        return resp.status(200).json("Deletado com sucesso!");
    } catch (error) {
        return resp.status(500).json({ error: error.message });
    }
});

servidor.put('/:tipo/:id', async (req, resp) => {
    try {
        const tipo = req.params.tipo;
        const id = req.params.id;
        const body = req.body;
        var resposta = []
        if (tipo == "retiradaItem") {
            resposta = await alterarQtdDisponivelItem(id, true, body);
        } else if (tipo == "devolucaoItem") {
            resposta = await alterarQtdDisponivelItem(id, false, body);
        } else {
            resposta = await alterar(tipo, id, body);
        }
        resp.send(resposta);
    } catch (error) {
        resp.status(500).send({ erro: 'Erro interno do servidor.', error });
    }
})

//cuidado, usar somente se for de extrema necessidade, pois excluirá TODAS AS INFORMAÇÕES
servidor.delete('/:tipo', async (req, resp) => {
    try {
        const tipo = req.params.tipo;
        await deletarTudo(tipo);
        resp.status(200).json("deletado com sucesso!");
    } catch (error) {
        resp.status(500).json({ error: error.message });
    }
})

export default servidor;