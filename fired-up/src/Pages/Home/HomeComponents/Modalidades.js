import CardModalidade from "../../../Components/CardModalidade";
import './index.scss'

export default function Modalidades(params) {
  return (
    <section className="modalidades">
      <h1>Modalidades</h1>
      <p className="texto">Selecione uma modalidade e descubra uma lista completa de times procurando jogadores para eventos esportivos locais. Explore diferentes esportes próximos a você, com detalhes como localização, data, hora, nível de habilidade e número de participantes necessários. Inscreva-se em um time e aguarde a confirmação para desfrutar de uma partida emocionante com outros entusiastas do esporte!</p>
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