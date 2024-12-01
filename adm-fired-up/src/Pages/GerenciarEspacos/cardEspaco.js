import { useEffect, useState } from "react"
import { buscar } from "../../API/chamadas"

export default function CardEspaco(params) {
    const [horarios, setHorarios] = useState([])
    const [modalidades, setModalidades] = useState([])
    const [itens, setItens] = useState([])

    const horariosAgrupados = horarios.reduce((acc, horario) => {
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

    useEffect(() => {
        const fetchHorarios = async () => {
            try {
                const result = await buscar(`HorarioFuncionamento/idEspaco/${params.espaco.idEspaco}`)
                setHorarios(result)
            } catch (error) {
                if (error.status !== 404) {
                    console.log(error);
                }
            }
            try {
                const result = await buscar(`ModalidadeEspaco/idEspaco/${params.espaco.idEspaco}`)
                const nomesModalidades = result
                    .map(item => {
                        const modalidade = params.modalidades.find(mod => mod.idModalidade === item.idModalidade);
                        return modalidade ? modalidade.Nome : null;
                    })
                    .filter(nome => nome !== null);
                setModalidades(nomesModalidades)
            } catch (error) {
                if (error.status !== 404) {
                    console.log(error);
                }
            }
            try {
                const result = await buscar(`ItemEspaco/idEspaco/${params.espaco.idEspaco}`)
                const nomesItens = result
                    .map(item => {
                        const itemEspaco = params.itens.find(mod => mod.idItem === item.idItem);
                        return itemEspaco ? itemEspaco.Nome : null;
                    })
                    .filter(nome => nome !== null);
                setItens(nomesItens)
            } catch (error) {
                if (error.status !== 404) {
                    console.log(error);
                }
            }
        }
        if (params.espaco) {
            fetchHorarios()
        }
    }, [])

    return (
        <div className="card cardEspaco">
            <div>
                <div>
                    <img src={params.espaco.Foto} alt={`Foto da ${params.espaco.Nome}`} />
                </div>
                <p>{params.espaco.Nome}</p>
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
                <p>Horario de funcionamento</p>
                {Object.keys(horariosAgrupados).map(dia => (
                    <p key={dia}>
                        {dia} {horariosAgrupados[dia].join(' e ')}
                    </p>
                ))}
            </div>

            <div>
                <p>Modalidades que podem ser praticadas</p>
                {modalidades &&
                    modalidades.map(modalidade => (
                        <div>
                            <p>{modalidade}</p>
                        </div>
                    ))
                }
            </div>

            <div>
                <p>Itens que podem ser retirados</p>
                {itens &&
                    itens.map(item => (
                        <div>
                            <p>{item}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )

}