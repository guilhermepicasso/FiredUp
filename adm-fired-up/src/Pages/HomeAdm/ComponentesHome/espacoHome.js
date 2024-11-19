import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.scss'

export default function EspacoHome(params) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/GerenciarEspacos');
      };

    return (
        <section className="espaco">
            <div className="header">
                <h1>Gerenciar Espaços</h1>
            </div>
            <p className="texto">Nesta seção, você poderá criar, deletar e gerenciar os espaços, modalidades disponíveis e itens no centro esportivo do Senac.</p>
            <a className='botaoEspaco'onClick={handleClick}>IR PARA<br />GERENCIAR ESPAÇOS</a>
        </section>
    )
}