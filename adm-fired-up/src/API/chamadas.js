import axios from 'axios'

const API_Adress = 'http://192.168.15.16:5000/'

export async function verificacaoLogin(body) {
    let url = API_Adress + 'login/admin/';
    let resp = await axios.post(url, body);
    return resp;
}

export async function criar(params) {
    let url = API_Adress + params.tabela;
    let resp = await axios.post(url, params.body);
    return resp;
}

export async function alterarFotoEspaco( id, arquivoImagem) {
    let url = API_Adress + `imagem/espaco/${id}`
    const formData = new FormData();
    formData.append('imagens', arquivoImagem);
    const uploadConfig = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    };
    let resp = await axios.put(url, formData, uploadConfig);
    return resp.status;
}

export async function buscar(tabela) {
    let url = API_Adress + tabela;
    let resp = await axios.get(url);
    return resp.data;
}

