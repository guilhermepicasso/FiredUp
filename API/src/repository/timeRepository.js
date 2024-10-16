import con from "../conection.js";
import { deletarParticipante, listarParticipantesPorTime } from "./participanteRepository.js";

export async function novoTime(time) {
    try {
        let comando = `
            insert into time (
                modalidade, 
                registrador_id, 
                endereco, 
                data, 
                categoria, 
                informacoes, 
                max_participantes, 
                participantes_atual
                )
            values (?, ?, ?, ?, ?, ?, ?, ?)`

        let [resp] = await con.query(comando, [
            time.modalidade,
            time.registrador,
            time.endereco,
            time.data,
            time.categoria,
            time.informacoes,
            time.max_participantes,
            time.participantes_atual
        ])
        time.id = resp.insertId;
        return time;
    } catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            throw new Error('O ID do registrador é inválido.');
        }
        throw error;
    }
}

export async function listarTimes() {
    try {
        let comando = `SELECT * FROM time;`
        let resp = await con.query(comando, []);
        let linhas = resp[0];
        return linhas;
    } catch (error) {
        throw error;
    }
}

export async function listarTime(id) {
    try {
        let comando = `SELECT * FROM time WHERE id = ?;`
        let resp = await con.query(comando, [id]);
        let linhas = resp[0];
        return linhas;
    } catch (error) {
        throw error;
    }
}

export async function alterarTime(id, time) {
    try {
        let comando = `
            update time set
                endereco = ?, 
                data = ?, 
                categoria = ?, 
                informacoes = ?, 
                max_participantes = ?
            WHERE id = ?`

        await con.query(comando, [
            time.endereco,
            time.data,
            time.categoria,
            time.informacoes,
            time.max_participantes,
            id
        ])
        return time;
    } catch (error) {
        throw error;
    }
}

export async function alterarParticipantes(id, valor) {
    try {
        let comando = `UPDATE time SET participantes_atual = ? WHERE id = ?;`
        const resp = await con.query(comando, [
            valor,
            id
        ])
        return resp;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function deletarTime(id) {
    try {

        console.log('entrou na função deletarTime com o id ' + id);

        const participantes = await listarParticipantesPorTime(id);

        console.log(participantes);

        participantes.forEach(async participante => {
            console.log('deletando todos os participantes do time ' + id)
            await deletarParticipante(participante.id);
        });

        console.log("deletou todos os participantes do time!");

        let comando = `DELETE FROM time WHERE id = ?`
        let resp = await con.query(comando, [id]);
        if (resp[0].affectedRows !== 1) {
            throw new Error('Erro ao deletar time!');
        }
        
        console.log('função deletar funcionou');

        return resp[0];
    } catch (error) {
        throw error;
    }
}

