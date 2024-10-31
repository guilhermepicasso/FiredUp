import con from "../conection.js";

const usuarios = [
    { RA: '123456', nome: 'AlinePonzani' },
    { RA: '654321', nome: 'JoãoSilva' },
    { RA: '112233', nome: 'MariaOliveira' },
    { RA: '445566', nome: 'CarlosSouza' }
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
        if (tabela === "usuario") {
            let usuario = usuarios.find(u => u.RA === id);
            if (!usuario) {
                return null;
            }
            return usuario;
        } else {
            let comando = `SELECT * FROM ${tabela} WHERE ${busca} = ${id};`
            let resp = await con.query(comando);
            if (resp[0].length === 0) {
                const error = new Error(`Resource not found: id${tabela} = ${id}`);
                error.status = 404;
                throw error;
            }
            return resp[0];
        }
    } catch (error) {
        throw error;
    }
}

export async function listarReservasUsuario(id) {
    try {
        let comando = `SELECT r.* FROM Reserva r LEFT JOIN Equipe e ON r.idEquipe = e.idEquipe WHERE r.idResponsavel = "${id}" OR e.idResponsavel = "${id}";`
        let resp = await con.query(comando);
        if (resp[0].length === 0) {
            const error = new Error(`Resource not found: ${id}`);
            error.status = 404;
            throw error;
        }
        return resp[0];
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
            if (typeof body[key] === 'boolean') {
                body[key] = body[key] ? 1 : 0;
            }
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


        var customError = "";
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            customError = new Error(`O ID do ${tipo} é inválido.`);
            customError.status = 400;
            throw customError;
        } else if (error.code === 'ER_DUP_ENTRY') {
            customError = new Error(`Valor duplicado`);
            customError.status = 401;
            throw customError;
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

        let [resp] = await con.query(comando);

        if (resp.affectedRows === 0) {
            const error = new Error(`Resource not found: id${tipo} = ${id}`);
            error.status = 404;
            throw error;
        }
        return body;
    } catch (error) {
        throw error;
    }
}

export async function deletarPorId(tipo, id) {
    try {
        let comando = `DELETE FROM ${tipo} WHERE id${tipo} = ${id}`
        let [resp] = await con.query(comando);

        if (resp.affectedRows === 0) {
            const error = new Error(`Resource not found: id${tipo} = ${id}`);
            error.status = 404;
            throw error;
        }
        return resp;
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

