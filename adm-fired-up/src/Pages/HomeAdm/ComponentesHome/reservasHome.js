import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.scss'

export default function ReservasHome(params) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/GerenciarReservas');
      };

    return (
        <section className="reservas">
            <div className="header">
                <h1>Equipes em Espera</h1>
            </div>
            <p className="texto">*Nesta seção, são exibidos apenas os eventos mais próximos de ocorrer.</p>
            <div className="listaReservaPendente">
                {/* Lista de Reservas pendentes */}
            </div>
            <a className='botaoReservas'onClick={handleClick}>Ver Todas as Reservas</a>
        </section>
    )
}