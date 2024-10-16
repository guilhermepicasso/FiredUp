import con from "../conection.js";

export async function novaEquipe(body) {
    try {
        let comando = `insert into Equipe (NomeEquipe, isPublica, idResponsavel, idModalidade) values (?, ?, ?, ?)`

        let [resp] = await con.query(comando, [body.NomeEquipe, body.isPublica, body.idResponsavel, body. idModalidade])
        body.idEquipe = resp.insertId;
        return body;
    } catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            throw new Error('O ID do registrador é inválido.');
        }
        throw error;
    }
}

export async function alterarEquipe(id, body) {
    try {
        let comando = `update Equipe set NomeEquipe = ?, isPublica = ?  WHERE idEquipe = ?`
        await con.query(comando, [
            body.NomeEquipe,
            body.isPublica,
            id
        ])
        return body;
    } catch (error) {
        throw error;
    }
}