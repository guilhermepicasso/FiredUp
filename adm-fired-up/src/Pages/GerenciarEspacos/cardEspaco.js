import { useEffect, useState } from "react"
import Card from "./card"
import { buscarId } from "../../API/chamadas"
import CardModalidade from "./cardModalidade"

export default function CardEspaco(params) {
    const [modalidadesEspaco, setModalidadesEspaco] = useState([])
    const [itensEspaco, setItensEspaco] = useState([])
    const [horariosEspaco, setHorariosEspaco] = useState([])

    const horariosAgrupados = horariosEspaco.reduce((acc, horario) => {
        if (acc[horario.diaSemana]) {
            acc[horario.diaSemana].push(
                `das ${horario.horaInicio.slice(0, 5)} às ${horario.horaFim.slice(0, 5)}`
            );
        } else {
            acc[horario.diaSemana] = [
                `das ${horario.horaInicio.slice(0, 5)} às ${horario.horaFim.slice(0, 5)}`
            ];
        }
        return acc;
    }, {});

    const fetchInfo = async (tabela) => {
        try {
            const result = await buscarId({ tabela: tabela, busca: "idEspaco", id: params.espaco.idEspaco })
            if (tabela === "modalidadeEspaco") {
                const modalidades = params.modalidades.filter(mod => mod.idModalidade === result.data[0].idModalidade);
                modalidades.forEach(modalidade => {
                    modalidade.idModalidadeEspaco = result.data[0].idModalidadeEspaco;
                });
                setModalidadesEspaco(modalidades);
            } else if (tabela === "itemEspaco") {
                const itens = params.itens.filter(itensEspaco => itensEspaco.idItem === result.data[0].idItem);
                itens.forEach(item => {
                    item.idItemEspaco = result.data[0].idItemEspaco;
                })
                setItensEspaco(itens);
            } else {
                setHorariosEspaco(result.data);
            }
        } catch (error) {
            if (error.status !== 404) {
                console.log(error);

            }
        }
    }

    useEffect(() => {
        fetchInfo("modalidadeEspaco");
        fetchInfo("itemEspaco");
        fetchInfo("HorarioFuncionamento");
    }, [])

    return (
        <div className="card cardEspaco">
            <div>
                <div>
                    <img src={params.espaco.Foto} alt={`Foto da ${params.espaco.Nome}`} />
                </div>
                <p className="cardTitle">{params.espaco.Nome}</p>
                <div>
                    <p>Regras</p>
                    <textarea
                        rows="5"
                        cols="30"
                        style={{
                            overflowY: 'auto', /* Habilita a rolagem vertical */
                            resize: 'vertical', /* Permite redimensionar o campo */
                        }}
                        value={params.espaco.Regras}
                        readOnly={true} // O textarea é somente leitura se isEditable for falso
                    />
                </div>
            </div>

            <div>
                <p className="cardTitle">Horario de funcionamento</p>
                {horariosEspaco && (
                    Object.keys(horariosAgrupados).map(dia => (
                        <p key={dia}>
                            {dia} {horariosAgrupados[dia].join(' e ')}
                        </p>
                    ))
                )}
            </div>

            <div>
                <p className="cardTitle">Modalidades que podem ser praticadas</p>
                <div className="list">
                    {modalidadesEspaco.map(modalidade => (
                        <CardModalidade modalidade={modalidade} editalvel={false} />
                    ))
                    }
                </div>
            </div>

            <div>
                <p className="cardTitle">Itens que podem ser retirados</p>
                <div className="list">
                    {itensEspaco.map(item => (
                        <CardModalidade modalidade={item} editalvel={false} />
                    ))
                    }
                </div>
            </div>
        </div>
    )

}