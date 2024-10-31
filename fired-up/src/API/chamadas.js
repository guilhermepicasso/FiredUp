import axios from 'axios'

const API_Adress = 'http://127.0.0.1:5000/'

export async function verificacaoLogin(body) {
    let url = API_Adress + '/login/';
    let resp = await axios.post(url, body);
    return resp;
}

export async function buscarUsuario(id) {
    let url = API_Adress + `usuario/null/${id}`;    
    let resp = await axios.get(url);
    return resp.data;
}