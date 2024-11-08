import axios from 'axios'

const API_Adress = 'http://192.168.15.16:5000/'

export async function verificacaoLogin(body) {
    let url = API_Adress + 'login/';
    let resp = await axios.post(url, body);
    return resp;
}

export async function buscarEquipes() {
    let url = API_Adress + `equipe`;
    let resp = await axios.get(url);
    return resp.data;
}

export async function buscaPorId(tabela, coluna, param) {
    let url = API_Adress + tabela `/${coluna}/${param}`;
    let resp = await axios.get(url);
    return resp.data;
}

export async function buscarEquipesQueParticipo(idUsuario) {
    let url = API_Adress + `participante/idUsuario/${idUsuario}`;
    let resp = await axios.get(url);
    return resp.data;
}

export async function buscarModalidades() {
    let url = API_Adress + `modalidade`;
    let resp = await axios.get(url);
    return resp.data;
}

export async function buscarParticipantes() {
    let url = API_Adress + `participante`;
    let resp = await axios.get(url);
    return resp.data;
}

export async function addParticipante(params) {
    let url = API_Adress + `participante`;
    const body = {
        "idUsuario": params.usuario,
        "idEquipe": params.idEquipe,
        "DataEntrada": new Date().toISOString()
    };
    let resp = await axios.post(url, body);
    return resp.data;
}
