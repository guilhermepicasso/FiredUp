import con from "../conection.js";
import { alterarParticipantes, listarTime } from "./timeRepository.js";

export async function novoParticipante(participante) {
    try {
        let comando = `
        insert into participantes (
            usuario_id, 
            time_id
            )
            values (?, ?)`

        let [resp] = await con.query(comando, [
            participante.usuario,
            participante.time
        ])
        participante.id = resp.insertId;
        return participante;
    } catch (error) {
        if (error.errno === 1062) {
            throw new Error('PARTICIPANTE_JA_EXISTE');
        }
        throw error;
    }
}

export async function buscarParticipante(id) {
    try {
        let comando = `SELECT * FROM participantes where id = ?;`
        let resp = await con.query(comando, [id]);
        let linhas = resp[0];
        return linhas;
    } catch (error) {
        throw error;
    }
}

export async function listarParticipantesPorTime(id_time) {
    try {
        let comando = `SELECT * FROM participantes where time_id = ?;`
        let resp = await con.query(comando, [id_time]);
        let linhas = resp[0];
        return linhas;
    } catch (error) {
        throw error;
    }
}

export async function listarParticipantes() {
    try {
        let comando = `SELECT * FROM participantes;`
        let resp = await con.query(comando, []);
        let linhas = resp[0];
        return linhas;
    } catch (error) {
        throw error;
    }
}

export async function listarTimesPorParticipante(id_usuario) {
    try {
        let comando = `SELECT * FROM participantes where usuario_id = ?;`
        let resp = await con.query(comando, [id_usuario]);
        let linhas = resp[0];
        return linhas;
    } catch (error) {
        throw error;
    }
}

export async function deletarParticipante(id) {
    try {
        const participante = await buscarParticipante(id);
        if (!participante.length) {
            throw new Error('Participante não encontrado!');
        }
        const infoTime = await listarTime(participante[0].time_id);
        if (infoTime[0].participantes_atual > 0) {
            let comando = `DELETE FROM participantes WHERE id = ?;`
            let resp = await con.query(comando, [id]);
            if (resp[0].affectedRows !== 1) {
                throw new Error('Erro ao deletar participante!');
            }
            const teste = await alterarParticipantes(infoTime[0].id, infoTime[0].participantes_atual - 1);
            if (teste[0].affectedRows === 0) {
                throw new Error('Erro ao atualizar participantes do time!');
            }
            return resp[0];
        } else {
            throw new Error('Quantidade de participantes é ' + infoTime[0].participantes_atual);
        }
    } catch (error) {
        throw error;
    }
}
