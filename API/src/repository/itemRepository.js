import con from "../conection.js";
import { listarPorId } from "./mainRepository.js";

export async function alterarQtdDisponivelItem(id, isTrue, body) {
    try {
        // Obtenção das informações do item pelo ID
        let informacao = await listarPorId("item", "idItem", id);

        let qtdTotal = informacao[0].QtdTotal;
        let qtdDisponivel = informacao[0].QtdDisponivel;

        // Validação para retirada
        if (isTrue) {
            if (qtdDisponivel < 1 || body.qtd > qtdDisponivel) {
                const error = new Error("Quantidade de item insuficiente para retirada.");
                error.status = 400;  // Define o código de status HTTP 400
                throw error;  // Lança o erro
            }
            qtdDisponivel -= body.qtd;
        } 
        // Validação para devolução
        else {
            qtdDisponivel += body.qtd;
            if (qtdDisponivel > qtdTotal) {
                const error = new Error("Quantidade total de itens ultrapassada.");
                error.status = 400;  // Define o código de status HTTP 400
                throw error;  // Lança o erro
            }
        }

        // Atualiza a quantidade disponível no banco de dados
        let comando = `UPDATE item SET QtdDisponivel = ${qtdDisponivel} WHERE idItem = ${id}`;
        let [resp] = await con.query(comando);

        if (resp.affectedRows === 0) {
            const error = new Error(`Resource not found!`);
            error.status = 404;
            throw error;
        }

        // Retorna uma mensagem de sucesso com a nova quantidade disponível
        return { msg: "Quantidade disponível atualizada com sucesso.", qtdDisponivel: qtdDisponivel };

    } catch (error) {
        // Repassa o erro para o bloco que chama a função
        throw error;
    }
}
