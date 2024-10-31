import axios from 'axios'

import { API_ADDRESS } from './constant';


export async function login(corpo) {
    let url = API_ADDRESS + '/login/';
    let r = await axios.post(url, corpo);
    return r.data;
}