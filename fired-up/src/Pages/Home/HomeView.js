import Header from "../../Components/Header";
import "./index.scss"
import Modalidades from "./HomeComponents/Modalidades";
import { useEffect, useState } from 'react';
import Sobre from "./HomeComponents/Sobre";
import Footer from "../../Components/Footer";
import { buscar } from "../../API/chamadas";

function HomeView() {
  const [modalidades, setModalidades] = useState([]);

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const response = await fetch('/modalidades.json');
  //       if (!response.ok) {
  //         throw new Error('Erro ao carregar o arquivo JSON');
  //       }
  //       const data = await response.json();
  //       setModalidades(data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchModalidades = async () => {
        try {
            const modalidades = await buscar('modalidade');
            setModalidades(modalidades);
        } catch (error) {
            console.log(error);
        }
    }
    fetchModalidades();
}, [])

  // Função de rolagem
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="HomeView">
      {/* Passando a função scrollToSection como prop */}
      <Header scrollToSection={scrollToSection} />

      <section className="container" />

      <section id="modalidades">
        <Modalidades modalidades={modalidades} />
      </section>

      <section id="sobre">
        <Sobre />
      </section>

      <Footer />
    </div>
  );
}

export default HomeView;
