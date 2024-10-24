import './index.scss'
import { Link } from 'react-router-dom'
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { login } from '../../Api/firedUpApi';
import { API_ADDRESS } from '../../Api/constant';
import { toast } from 'react-toastify'
import axios from 'axios';

function Login() {
    const [ra, setRa] = useState('');
    const [nome, setNome] = useState('');
    const navigate = useNavigate();

    const handleClick = async () => {
        if (!ra || !nome) {
            toast.info("Por favor, preencha todos os campos");
            return;
        }
        try {
            const corpo = {
                ra: ra,
                senha: nome
            };
            const response = await login(corpo);
            console.log("resposta retornada");
            if (response.token) {
                localStorage.setItem('token', response.token);
                toast.success("Login efetuado com Sucesso")
                console.log("Login efetuado :" + corpo);
                navigate('/');
            }
        } catch (error) {
            if (error.response && (error.response.status === 404 || error.response.status === 401)) {
                toast.warning("Credenciais inválidas");
            } else {
                toast.warning("Erro ao fazer o Login: " + error.message);
            }
            console.log(error.message);
        }
    }
    return (
        <section className='login_page'>
            <div className='Login_container'>
                <img className='logo' src='/Assets/images/logoFired.png' alt='Logo da FiredUp' />
                <div>
                    <div className='LoginSlogan'>
                        <h1>Bem-vindo</h1>
                        <span>Entre com as credenciais de acesso do Senac</span>
                    </div>
                    <div className='inputs'>
                        <label htmlFor="inputRa">RA de Matrícula:</label>
                        <input
                            type="number"
                            id="inputRa"
                            value={ra}
                            onChange={e => setRa(e.target.value)}
                        />
                    </div>
                    <div className='inputs'>
                        <label htmlFor="inputName">Insira seu nome:</label>
                        <input
                            type="text"
                            id="inputName"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                        />
                    </div>
                    <a onClick={handleClick} className="login_link">
                        <span>Entrar</span>
                    </a>
                </div>
            </div>
            <div className='Login_banner'>
                <h1>Centro Esportivo</h1>
                <img className='banner' src='/Assets/images/logoBanner.png' alt='Banner Login' />
            </div>
        </section>
    );
}

export default Login;
