import axios from 'axios'

const API_Adress = 'http://localhost:5000/';

export async function verificacaoLogin(body) {
    let url = API_Adress + 'login/admin/';
    let resp = await axios.post(url, body);
    return resp;
}

export async function alterar(params) {
    let url = API_Adress + `${params.tabela}/${params.id}`;
    let resp = await axios.put(url, params.body);
    return resp.data;
}


export async function criar(params) {
    let url = API_Adress + params.tabela;
    let resp = await axios.post(url, params.body);
    return resp;
}

export async function buscarId(params) {
    let url = API_Adress + `${params.tabela}/${params.busca}/${params.id}`;
    let resp = await axios.get(url);
    return resp;
}

export async function deletar(params) {
    let url = API_Adress + `${params.tabela}/${params.id}`;
    let resp = await axios.delete(url);
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

