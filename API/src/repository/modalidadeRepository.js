import con from "../conection.js";

export async function novaModalidade(modalidade) {
    try {
        let comando = `insert into modalidade (nome) values (?)`

        let [resp] = await con.query(comando, [modalidade.nome])
        modalidade.idModalidade = resp.insertId;
        return modalidade;
    } catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            throw new Error('O ID do registrador é inválido.');
        }
        throw error;
    }
}

export async function alterarModalidade(id, modalidade) {
    try {
        let comando = `update modalidade set nome = ? WHERE idModalidade = ?`
        await con.query(comando, [
            modalidade.nome,
            id
        ])
        return modalidade;
    } catch (error) {
        throw error;
    }
}

export async function inserirModalidadeEspaco(body) {
    try {
        let comando = `insert into ModalidadeEspaco (idModalidade, idEspaco) values (?, ?)`

        let [resp] = await con.query(comando, [body.idModalidade, body.idEspaco])
        body.idModalidadeEspaco = resp.insertId;
        return body;
    } catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            throw new Error('O ID do registrador é inválido.');
        }
        throw error;
    }
}