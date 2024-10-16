import con from "../conection.js";

export async function novoEspaco(espaco) {
    try {
        let comando = `insert into espaco (nome, resgras) values (?, ?)`

        let [resp] = await con.query(comando, [espaco.nome, espaco.regras])
        espaco.idEspaco = resp.insertId;
        return espaco;
    } catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            throw new Error('O ID do registrador é inválido.');
        }
        throw error;
    }
}

export async function alterarEspaco(id, espaco) {
    try {
        let comando = `update espaco set nome = ?, resgras = ?  WHERE idModalidade = ?`
        await con.query(comando, [
            espaco.nome,
            espaco.regras,
            id
        ])
        return espaco;
    } catch (error) {
        throw error;
    }
}

export async function inserirDisponibilidade(disponibilidade, idEspaco) {
    try {
        let comando = `insert into DisponibilidadeEspaco (idEspaco, DiaSemana, HoraInicio, HoraFim) values (?, ?, ?, ?)`

        let [resp] = await con.query(comando, [idEspaco, disponibilidade.diaSemana, disponibilidade.horaInicio, disponibilidade.horaFim])
        disponibilidade.idDisponibilidade = resp.insertId;
        return disponibilidade;
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