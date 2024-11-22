import axios from 'axios'

const API_Adress = 'http://localhost:5000/'

export async function verificacaoLogin(body) {
    let url = API_Adress + 'login/';
    let resp = await axios.post(url, body);
    return resp;
}

export async function buscar(tabela) {
    let url = API_Adress + tabela;
    let resp = await axios.get(url);
    return resp.data;
}

export async function create(tabela, body) {
    let url = API_Adress + tabela;
    let resp = await axios.post(url, body);
    return resp;
}

export async function deletar(tabela) {
    let url = API_Adress + tabela;
    let resp = await axios.delete(url);
    return resp;
}
