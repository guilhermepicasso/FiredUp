import con from "../conection.js";

export async function exibirUsuarios() {
  try {
    // Lista de usuários pré-setada
    const usuarios = [
      { RA: '123456', nome: 'Aline Ponzani' },
      { RA: '654321', nome: 'João Silva' },
      { RA: '112233', nome: 'Maria Oliveira' },
      { RA: '445566', nome: 'Carlos Souza' }
    ];

    // Simulando o retorno como se fosse de um banco de dados
    return usuarios;
  } catch (error) {
    throw error;
  }
}


export async function exibirUsuario(ra) {
  try {
    // Lista de usuários com RA e nome
    const usuarios = [
      { RA: '123456', nome: 'Aline Ponzani' },
      { RA: '654321', nome: 'João Silva' },
      { RA: '112233', nome: 'Maria Oliveira' },
      { RA: '445566', nome: 'Carlos Souza' }
    ];

    // Procura o usuário pelo RA na lista
    let usuario = usuarios.find(u => u.RA === ra);

    // Se não encontrar o usuário, retorna null ou vazio
    if (!usuario) {
      return null;
    }

    // Retorna o usuário encontrado
    return usuario;
  } catch (error) {
    throw error;
  }
}

export async function listarTimesUsuario(id) {
  try {
    let comando = `SELECT * from time WHERE registrador_id = ?`
    let resp = await con.query(comando, [id]);
    let linhas = resp[0];

    return linhas;
  } catch (error) {
    throw error;
  }
}
