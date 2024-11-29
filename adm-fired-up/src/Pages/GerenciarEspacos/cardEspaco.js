import { useEffect, useState } from "react"
import { buscar } from "../../API/chamadas"

export default function CardEspaco(params) {
    const [horarios, setHorarios] = useState([])
    const [modalidades, setModalidades] = useState([])
    const [itens, setItens] = useState([])

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
                setModalidades(result)
            } catch (error) {
                if (error.status !== 404) {
                    console.log(error);
                }
            }
            try {
                const result = await buscar(`ItemEspaco/idEspaco/${params.espaco.idEspaco}`)
                setItens(result)
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
        <div className="card cardItens">
            <div>
                <div>
                    <img></img>
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
                    >
                        {params.espaco.regras}
                    </textarea>
                </div>
            </div>

            <div>
                <p>Horario de funcionamento</p>
                {horarios &&
                    horarios.map(horario => (
                        <div>
                            <p>{horario.diaSemana}</p>
                            <p>{horario.horaInicio} as {horario.horaFim}</p>
                        </div>
                    ))
                }

            </div>

            <div>
                <p>Modalidades que podem ser praticadas</p>
                {modalidades &&
                    modalidades.map(modalidade => (
                        <div>
                            <p>{modalidade.idModalidade}</p>
                        </div>
                    ))
                }
            </div>
            
            <div>
                <p>Itens que podem ser retirados</p>
                {itens &&
                    itens.map(item => (
                        <div>
                            <p>{item.idItem}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )

}