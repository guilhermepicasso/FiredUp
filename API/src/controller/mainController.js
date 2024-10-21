import multer from "multer";

import { Router } from "express";

import { alterar, criar, deletarPorId, deletarTudo, listarPorId, listarReservasUsuario, listarTodos } from "../repository/mainRepository.js";
import { alterarQtdDisponivelItem } from "../repository/itemRepository.js";

const servidor = Router();

const upload = multer({ dest: 'storage/modalidade' });

servidor.post('/:tabela', async (req, resp) => {
    try {
        const tabela = req.params.tabela;
        const body = req.body;
        var resposta = await criar(tabela, body);
        if (resposta.length === 0) {
            resp.status(400).send({ erro: "Erro ao inserir na tabela " + tabela });
        }
        resp.send(resposta);
    } catch (error) {
        console.log(error);
        const statusCode = error.status || 500;
        const errorMessage = error.message || 'Erro interno do servidor.';
        resp.status(statusCode).send({ erro: errorMessage });
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

servidor.get('/:tipo/:id', async (req, resp) => {
    try {
        const tipo = req.params.tipo;
        const id = req.params.id;
        const resposta = await listarReservasUsuario(id);
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
        resp.status(200).send(resposta);
    } catch (error) {
        if (error.status === 404) {
            resp.status(404).send({ erro: 'Id não encontrado.' });
        } else {
            resp.status(500).send({ erro: 'Erro interno do servidor.', error });
        }
    }
})

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
        if (error.status === 404) {
            resp.status(404).send({ erro: 'Id não encontrado.' });
        } else if (error.status === 400) {
            resp.status(400).send({ erro: 'Valores não correspondentes.', error });
        } else {
            resp.status(500).send({ erro: 'Erro interno do servidor.', error });
        }
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
        if (error.status === 404) {
            resp.status(404).send({ erro: 'Id não encontrado.' });
        } else {
            resp.status(500).send({ erro: 'Erro interno do servidor.', error });
        }
    }
});

//cuidado, usar somente se for de extrema necessidade, pois excluirá TODAS AS INFORMAÇÕES
servidor.delete('/:tipo', async (req, resp) => {
    try {
        const tipo = req.params.tipo;
        await deletarTudo(tipo);
        resp.status(200).json("deletado com sucesso!");
    } catch (error) {
        if (error.status === 404) {
            resp.status(404).send({ erro: 'Id não encontrado.' });
        } else {
            resp.status(500).send({ erro: 'Erro interno do servidor.', error });
        }
    }
})

export default servidor;