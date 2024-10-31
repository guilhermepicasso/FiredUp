import Header from "../../Components/Header";
import "./index.scss"
import Modalidades from "./HomeComponents/Modalidades";
import { useEffect, useState } from 'react';
import Sobre from "./HomeComponents/Sobre";
import Footer from "../../Components/Footer";


function HomeView() {
  const [modalidades, setModalidades] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/modalidades.json');
        if (!response.ok) {
          throw new Error('Erro ao carregar o arquivo JSON');
        }
        const data = await response.json();
        setModalidades(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="HomeView">
      <Header />

      <section className="container" />

      <section id="modalidades">
        <Modalidades modalidades={modalidades}></Modalidades>
      </section>

      <section>
        <Sobre></Sobre>
      </section>

    ;<footer>
<Footer></Footer>
    </footer>
    </div>
  );
}

export default HomeView;