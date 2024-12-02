import './index.scss'
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { verificacaoLogin } from '../../API/chamadas.js';
import { useAuth } from "../../Components/UserContext/AuthContext.js"
import { jwtDecode } from "jwt-decode";


function Login() {
    const [ra, setRa] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleClick = async () => {
        if (!ra || !senha) {
            toast.info("Por favor, preencha todos os campos");
            return;
        }
        try {
            const corpo = {
                ra: ra,
                senha: senha
            };
            const response = await verificacaoLogin(corpo);
            const { token } = response.data;

            if (token) {
                localStorage.setItem('token', token);
                const decoded = jwtDecode(token);
                toast.success("Login efetuado com Sucesso");
                login(decoded.infoUsuario);
                navigate(-1);
            }
        } catch (error) {
            if (error.response && (error.response.status === 404 || error.response.status === 401)) {
                toast.warning("Credenciais inválidas");
            } else {
                toast.warning("Erro ao fazer o Login: " + error.message);
            }
            console.log( "erro é ", error.message);
        }
    };

    return (
        <section className='login_page'>
            <div className='Login_container'>
                <div className='logo'>
                    <img src='/Assets/images/logoFired.png' alt='Logo da FiredUp' />
                </div>
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
                            value={senha}
                            onChange={e => setSenha(e.target.value)}
                        />
                    </div>
                    <div onClick={handleClick} className="login_link">
                        <span>Entrar</span>
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
