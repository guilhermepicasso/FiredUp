import con from "../conection.js";
import { listarPorId } from "./mainRepository.js";

export async function alterarQtdDisponivelItem(id, tipo, body) {
    try {
        let informacao = await listarPorId("item", id);
        let qtdTotal = informacao[0].QtdTotal;
        let qtdDisponivel = informacao[0].QtdDisponivel;
        if (tipo) {
            if (qtdDisponivel < 1 || body.qtd > qtdDisponivel) {
                return { erro: "Quantidade de item insuficiente para retirada!" };
            }
            qtdDisponivel -= body.qtd
        } else {
            qtdDisponivel += body.qtd
            if (qtdDisponivel > qtdTotal) {
                return { erro: "Quantidade total de itens ultrapassada!" };
            }
        }
        let comando = `update item set QtdDisponivel = ? WHERE idItem = ?`
        let resp = await con.query(comando, [
            qtdDisponivel,
            id
        ])

        return { msg: "Quantidade disponível atualizada com sucesso.", qtdDisponivel: qtdDisponivel };
    } catch (error) {
        throw error;
    }
}