import "./index.scss"
import { useEffect, useState } from 'react';
import Footer from "../../components/Footer";
import Reservas from "./ComponentesHome/reservasHome";
import GerenciarEspaco from "./ComponentesHome/espacoHome";
import Header from "../../components/Header";
import { } from "../../API/chamadas";


function HomeViewADM() {

    useEffect(() => {
    }, [])

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="HomeView">
            <Header scrollToSection={scrollToSection} />
            <section id="reservas">
                <Reservas />
            </section>
            <section id="espacos">
                <GerenciarEspaco />
            </section>
            <Footer />
        </div>
    );
}

export default HomeViewADM;
