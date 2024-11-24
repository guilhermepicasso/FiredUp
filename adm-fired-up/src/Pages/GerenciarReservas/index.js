import "./index.scss"
import { useEffect, useState } from 'react';
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import ReservasTable from "../../components/ReservasTable";
import { } from "../../API/chamadas";

function GerenciarReservas(params) {
    return (
        <div className="GerenciarReserva">
            <Header />
            <div className="section">
                <h1>Gerenciar Reservas</h1>
                <div className="tabelaADM">
                    <ReservasTable />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default GerenciarReservas;