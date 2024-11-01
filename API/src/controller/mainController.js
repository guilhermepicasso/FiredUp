import multer from "multer";

import { Router } from "express";

import { alterar, alterarImagem, criar, deletarPorId, deletarTudo, listarPorId, listarReservasUsuario, listarTodos } from "../repository/mainRepository.js";
import { alterarQtdDisponivelItem } from "../repository/itemRepository.js";

const servidor = Router();

const upload = multer({ dest: 'storage/imagens' });

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

servidor.get('/:tabela', async (req, resp) => {
    try {
        const tabela = req.params.tabela;
        const resposta = await listarTodos(tabela);
        resp.status(200).send(resposta);
    } catch (error) {
        resp.status(500).send({ erro: 'Erro interno do servidor.' });
    }
});

servidor.get('/:tabela/:id', async (req, resp) => {
    try {
        const tabela = req.params.tabela;
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

servidor.put('/:tabela/:id', async (req, resp) => {
    try {
        const tabela = req.params.tabela;
        const id = req.params.id;
        const body = req.body;
        var resposta = []
        if (tabela == "retiradaItem") {
            resposta = await alterarQtdDisponivelItem(id, true, body);
        } else if (tabela == "devolucaoItem") {
            resposta = await alterarQtdDisponivelItem(id, false, body);
        } else {
            resposta = await alterar(tabela, id, body);
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

servidor.delete('/:tabela/:id', async (req, resp) => {
    try {
        const tabela = req.params.tabela;
        const id = req.params.id;

        // Exclui diretamente o registro da tabela principal
        await deletarPorId(tabela, id);  // O CASCADE cuidará dos relacionamentos

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
servidor.delete('/:tabela', async (req, resp) => {
    try {
        const tabela = req.params.tabela;
        await deletarTudo(tabela);
        resp.status(200).json("deletado com sucesso!");
    } catch (error) {
        if (error.status === 404) {
            resp.status(404).send({ erro: 'Id não encontrado.' });
        } else {
            resp.status(500).send({ erro: 'Erro interno do servidor.', error });
        }
    }
})


// Alterar image
servidor.put('/imagem/:tabela/:id', upload.single('imagens'), async (req, resp) => {
    console.log("entrou na função de editar imagem");
    
    try {
        const tabela = req.params.tabela;
        const id = req.params.id;
        let imagem = req.file.path;
        console.log(imagem);
        let linhasAfetadas = await alterarImagem(tabela, id, imagem);
        console.log(linhasAfetadas);
        if (linhasAfetadas == 0) {
            resp.status(404).send();
        }else{
            resp.status(202).send();
        }
    } catch (error) {

        resp.status(500).json({ error: error.message });
    }
})




export default servidor;