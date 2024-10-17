import con from "../conection.js";

const usuarios = [
    { RA: '123456', nome: 'Aline Ponzani' },
    { RA: '654321', nome: 'João Silva' },
    { RA: '112233', nome: 'Maria Oliveira' },
    { RA: '445566', nome: 'Carlos Souza' }
];

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
        if (tipo === "usuario") {
            return usuarios;
        } else {
            let comando = `SELECT * FROM ${tipo};`
            let resp = await con.query(comando, []);
            let linhas = resp[0];
            return linhas;
        }
    } catch (error) {
        throw error;
    }
}

export async function listarPorId(tabela, busca, id) {
    try {
        console.log("entrou no listar por id para buscar "+tabela);
        if (tabela === "usuario") {
            let usuario = usuarios.find(u => u.RA === id);

            // Se não encontrar o usuário, retorna null ou vazio
            if (!usuario) {
                return null;
            }

            // Retorna o usuário encontrado
            return usuario;
        } else {
            let comando = `SELECT * FROM ${tabela} WHERE id${busca} = ?;`
            let resp = await con.query(comando, [id]);
            let linhas = resp[0];
            if (linhas.length === 0) return null;
            return linhas;
        }
    } catch (error) {
        throw error;
    }
}

export async function criar(tipo, body) {
    try {
        var comando = `insert into ${tipo} (`;

        // Obter as chaves do objeto body e iterar sobre elas
        const keys = Object.keys(body);
        keys.forEach((key, index) => {
            // Adicionar o campo e o valor dinâmico
            comando += `${key}`;

            // Adicionar uma vírgula se não for o último item
            if (index < keys.length - 1) {
                comando += ', ';
            }
        });

        comando += `) values (`;
        comando += keys.map(key => `'${body[key]}'`);
        comando += `)`;

        let [resp] = await con.query(comando);
        body.id = resp.insertId;
        return body;
    } catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            throw new Error('O ID do registrador é inválido.');
        }
        throw error;
    }
}

export async function alterar(tipo, id, body) {
    try {
        var comando = `UPDATE ${tipo} SET `;
        const keys = Object.keys(body);
        keys.forEach((key, index) => {
            comando += `${key} = '${body[key]}'`;
            if (index < keys.length - 1) {
                comando += ', ';
            }
        });
        comando += ` WHERE id${tipo} = ${id}`;
        await con.query(comando);
        return body;
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

