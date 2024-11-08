import CardModalidade from "../../../Components/CardModalidade";
import { useAuth } from "../../../Components/UserContext/AuthContext.js";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import './index.scss'

export default function Modalidades(params) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (isAuthenticated) {
      navigate('/equipes');
    } else {
      toast.info("Por favor, faça login antes");
    }
  };

  return (
    <section className="modalidades">
      <div className="header">
        <h1>Modalidades</h1>
        <button className="botaoEquipe" onClick={handleButtonClick}>Ver Equipes</button>
      </div>
      <p className="texto">Selecione uma modalidade e descubra uma lista completa de equipes procurando jogadores para eventos esportivos locais. Explore diferentes esportes próximos a você, com detalhes como localização, data, hora, nível de habilidade e número de participantes necessários. Inscreva-se em um time e aguarde a confirmação para desfrutar de uma partida emocionante com outros entusiastas do esporte!</p>
      <div className="listaModalidades">
        {params.modalidades.map(modalidade => (
          <CardModalidade
            id={modalidade.idModalidade}
            img={modalidade.Foto}
            modalidade={modalidade.Nome}
          />
        ))}
      </div>
    </section>
  )
}