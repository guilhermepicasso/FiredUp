import con from "../conection.js";

export async function alterarImagem(tipo, id, caminho) {
    try {
        let comando = `update ${tipo} set foto = ? where id${tipo} = ?;`
        let [resp] = await con.query(comando, [caminho, id]);
        if (resp.affectedRows !== 1) {
            throw new Error('Erro ao atualizar foto');
        }
        return resp.affectedRows;
    } catch (error) {
        throw error;
    }
}

export async function listarTodos(tipo) {
    try {
        let comando = `SELECT * FROM ${tipo};`
        let resp = await con.query(comando, []);
        let linhas = resp[0];
        return linhas;
    } catch (error) {
        throw error;
    }
}

export async function listarPorId(tipo, id) {
    try {
        let comando = `SELECT * FROM ${tipo} WHERE id${tipo} = ?;`
        let resp = await con.query(comando, [id]);
        let linhas = resp[0];
        if (linhas.length === 0) return null;
        return linhas;
    } catch (error) {
        throw error;
    }
}

export async function deletarPorId(tipo, id) {
    try {
        let comando = `DELETE FROM ${tipo} WHERE id${tipo} = ?`
        let resp = await con.query(comando, [id]);
        if (resp[0].affectedRows !== 1) {
            throw new Error('Erro ao tentar deletar!');
        }
        return resp[0];
    } catch (error) {
        throw error;
    }
}

export async function deletarTudo(tipo) {
    try {
        let comando = `DELETE FROM ${tipo}`;
        let resp = await con.query(comando);
        if (resp[0].affectedRows === 0) {
            throw new Error('Nenhuma linha foi deletada.');
        }
        return resp[0];
    } catch (error) {
        throw error;
    }
}

