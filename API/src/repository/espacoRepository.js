import con from "../conection.js";

export async function novoEspaco(body) {
    try {
        let comando = `insert into espaco (nome, resgras) values (?, ?)`

        let [resp] = await con.query(comando, [body.nome, body.regras])
        body.idEspaco = resp.insertId;
        return body;
    } catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            throw new Error('O ID do registrador é inválido.');
        }
        throw error;
    }
}

export async function alterarEspaco(id, body) {
    try {
        let comando = `update espaco set nome = ?, resgras = ?  WHERE idModalidade = ?`
        await con.query(comando, [
            body.nome,
            body.regras,
            id
        ])
        return body;
    } catch (error) {
        throw error;
    }
}

export async function inserirDisponibilidade(body) {
    try {
        let comando = `insert into DisponibilidadeEspaco (idEspaco, DiaSemana, HoraInicio, HoraFim) values (?, ?, ?, ?)`
        let [resp] = await con.query(comando, [body.idEspaco, body.diaSemana, body.horaInicio, body.horaFim])
        body.idDisponibilidadeEspaco = resp.insertId;
        return body;
    } catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            throw new Error('O ID do registrador é inválido.');
        }
        throw error;
    }
}

export async function alterarDisponibilidadeEspaco(id, body) {
    try {
        let comando = `update DisponibilidadeEspaco set HoraInicio = ?, HoraFim = ?  WHERE idDisponibilidade = ?`
        await con.query(comando, [
            body.horaInicio,
            body.horaFim,
            id
        ])
        return body;
    } catch (error) {
        throw error;
    }
}

export async function inserirItemEspaco(body) {
    try {
        let comando = `insert into ItemEspaco (idItem, idEspaco) values (?, ?)`

        let [resp] = await con.query(comando, [body.idItem, body.idEspaco])
        body.idItemEspaco = resp.insertId;
        return body;
    } catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            throw new Error('O ID do registrador é inválido.');
        }
        throw error;
    }
}