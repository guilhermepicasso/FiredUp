import con from "../conection.js";

const usuarios = [
    { RA: '123456', nome: 'AlinePonzani' },
    { RA: '654321', nome: 'JoãoSilva' },
    { RA: '112233', nome: 'MariaOliveira' },
    { RA: '445566', nome: 'CarlosSouza' }
];

const admin = [
    { RA: 'admin123456', nome: 'Admin 1' },
    { RA: 'admin654321', nome: 'Admin 2' },
    { RA: 'admin112233', nome: 'Admin 3' },
    { RA: 'admin445566', nome: 'Admin 4' }
];

export async function listarTodos(tabela) {
    try {
        if (tabela === "usuario") {
            return usuarios;
        } else if (tabela === "admin") {
            return admin;
        } else {
            let comando = `SELECT * FROM ${tabela};`
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
                return "Usuário não encontrado";
            }
            return usuario;
        } else if (tabela === "admin") {
            let usuario = admin.find(u => u.RA === id);
            if (!usuario) {
                return "Usuário não encontrado";
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

async function verificarHorarioExistente(idEspaco, diaSemana, horaInicio, horaFim) {
    const query = `
        SELECT COUNT(*) AS count
        FROM HorarioFuncionamento
        WHERE idEspaco = ? 
        AND diaSemana = ?
        AND NOT (
            horaFim <= ? OR horaInicio >= ?
        )
    `;
    
    const [result] = await con.query(query, [idEspaco, diaSemana, horaInicio, horaFim]);
    const teste = result[0].count >= 1
    return teste; // Retorna true se já existir um horário igual
}

export async function criar(tabela, body) {
    try {
        var customError = "";
        if (tabela === "participante") {
            // Consulta a quantidade máxima de participantes da equipe
            const [equipe] = await con.query(`SELECT QtdMaxima FROM Equipe WHERE idEquipe = ?`, [body.idEquipe]);

            if (!equipe) {
                customError = new Error("Equipe não encontrada.");
                customError.status = 400;
                throw customError;
            }

            // Consulta o número atual de participantes na equipe
            const [participantes] = await con.query(`SELECT COUNT(*) as count FROM Participante WHERE idEquipe = ?`, [body.idEquipe]);

            // Verifica se a equipe já atingiu a quantidade máxima de participantes
            if (participantes[0].count > equipe[0].QtdMaxima) {
                customError = new Error("A quantidade máxima de participantes para esta equipe já foi atingida.");
                customError.status = 400;
                throw customError;
            }
        }

        if (tabela === "HorarioFuncionamento") {
            const diasSemanaValidos = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

            if (!diasSemanaValidos.includes(body.diaSemana)) {
                customError = new Error(`Valor inválido para diaSemana: ${body.diaSemana}`);
                customError.status = 400;
                throw customError;
            }
            
            const verificacao = await verificarHorarioExistente(body.idEspaco, body.diaSemana, body.horaInicio, body.horaFim)            
            if (verificacao) {
                customError = new Error(`Horario de funcionamento ja cadastrado!`);
                customError.status = 400;
                throw customError;
            }
        }

        const keys = Object.keys(body);
        const values = keys.map(key => {
            if (typeof body[key] === 'boolean') {
                return body[key] ? 1 : 0; // Transforma boolean em 1 ou 0
            }
            return body[key];
        });

        // Construir comando SQL com placeholders
        const comando = `INSERT INTO ${tabela} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`;

        // Executar o comando
        const [resp] = await con.query(comando, values);

        // Retornar resposta com ID gerado
        body.id = resp.insertId;
        return body;
    } catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            customError = new Error(`O ID do ${tabela} é inválido.`);
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

export async function alterar(tabela, id, body) {
    try {
        var comando = `UPDATE ${tabela} SET `;
        const keys = Object.keys(body);
        keys.forEach((key, index) => {
            comando += `${key} = '${body[key]}'`;
            if (index < keys.length - 1) {
                comando += ', ';
            }
        });
        comando += ` WHERE id${tabela} = ${id}`;

        let [resp] = await con.query(comando);

        if (resp.affectedRows === 0) {
            const error = new Error(`Resource not found: id${tabela} = ${id}`);
            error.status = 404;
            throw error;
        }
        return body;
    } catch (error) {
        throw error;
    }
}

export async function deletarPorId(tabela, id) {
    try {
        let comando = `DELETE FROM ${tabela} WHERE id${tabela} = ${id}`
        let [resp] = await con.query(comando);

        if (resp.affectedRows === 0) {
            const error = new Error(`Resource not found: id${tabela} = ${id}`);
            error.status = 404;
            throw error;
        }
        return resp;
    } catch (error) {
        throw error;
    }
}

export async function deletarTudo(tabela) {
    try {
        let comando = `DELETE FROM ${tabela}`;
        let resp = await con.query(comando);
        if (resp[0].affectedRows === 0) {
            throw new Error('Nenhuma linha foi deletada.');
        }
        return resp[0];
    } catch (error) {
        throw error;
    }
}

export async function alterarImagem(link, id, caminho) {
    try {
        let comando = `update ${link} set foto = "${caminho}" where id${link} = ${id};`

        let [resp] = await con.query(comando);
        if (resp.affectedRows === 0) {
            const error = new Error(`Resource not found: ${link} = ${id}`);
            error.status = 404;
            throw error;
        }
        return resp.affectedRows;
    } catch (error) {
        throw error;
    }
}