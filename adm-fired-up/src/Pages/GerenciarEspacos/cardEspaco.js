import { useEffect, useState } from "react"
import Card from "./card"
import { buscarId, deletar } from "../../API/chamadas"
import CardModalidade from "./cardModalidade"
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function CardEspaco(params) {
    const navigate = useNavigate();
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
                console.log("resultado das modalidadaes",result);
                console.log("modalidades", params.modalidades);
                const modalidades = []

                result.data.forEach(modalidade => {
                    const modalidade_encontrada = params.modalidades.find(mod => mod.idModalidade === modalidade.idModalidade);
                    modalidade_encontrada.idModalidadeEspaco =  modalidade.idModalidadeEspaco
                    console.log(modalidade_encontrada);
                    modalidades.push(modalidade_encontrada)
                });
                setModalidadesEspaco(modalidades);
            } else if (tabela === "itemEspaco") {
                const itens = []

                result.data.forEach(item => {
                    const item_encontrado = params.itens.find(mod => mod.idItem === item.idItem);
                    item_encontrado.idItemEspaco =  item.idItemEspaco
                    itens.push(item_encontrado)
                });
                setItensEspaco(itens);
            } else {
                setHorariosEspaco(result.data);
            }
        } catch (error) {
            if (error.status !== 404) {
                console.log(error);
                toast.error("Erro ao buscar dados!")
            }
        }
    }

    const handleExcluir = (id) => {
        confirmAlert({
            title: 'Confirmar exclusão',
            message: 'Você tem certeza que deseja excluir este espaço ?',
            buttons: [
                {
                    label: 'Sim',
                    onClick: () => {
                        deletar({ tabela: "espaco", id })
                            .then(() => {
                                toast.success('Exclusão realizada com sucesso!');
                                params.change("Espaco");
                            })
                            .catch((error) => {
                                toast.error(`Erro ao excluir: ${error}`);
                            });
                    }
                },
                {
                    label: 'Não',
                    onClick: () => {
                        toast.info('Exclusão cancelada');
                    }
                }
            ]
        });
    };

    useEffect(() => {
        fetchInfo("modalidadeEspaco");
        fetchInfo("itemEspaco");
        fetchInfo("HorarioFuncionamento");
    }, [])

    return (
        <div className="card cardEspaco">
            <div>
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

            <div className="containerInfoEspaco">
                <div className="containerInfo">

                    <div className="infoEspaco">
                        <p className="cardTitle">Horario de funcionamento</p>
                        {horariosEspaco && (
                            Object.keys(horariosAgrupados).map(dia => (
                                <p key={dia}>
                                    {dia} {horariosAgrupados[dia].join(' e ')}
                                </p>
                            ))
                        )}
                    </div>

                    <div className="infoEspaco">
                        <p className="cardTitle">Modalidades que podem ser praticadas</p>
                        <div className="list">
                            {modalidadesEspaco.map(modalidade => (
                                <CardModalidade modalidade={modalidade} editalvel={false} />
                            ))
                            }
                        </div>
                    </div>

                    <div className="infoEspaco">
                        <p className="cardTitle">Itens que podem ser retirados</p>
                        <div className="list listEspaco">
                            {itensEspaco.map(item => (
                                <CardModalidade modalidade={item} editalvel={false} />
                            ))
                            }
                        </div>
                    </div>
                </div>
                <div className="botoesCardEspaco">
                    <Button
                        variant="contained"
                        onClick={() => handleExcluir(params.espaco.idEspaco)}
                        endIcon={<DeleteIcon />}
                        sx={{
                            backgroundColor: "red"
                        }}
                    >
                        Excluir espaço
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => 
                            navigate('/CriarEspaco', {
                                state: {
                                    espaco: params.espaco,
                                    itensEspaco: itensEspaco,
                                    modalidadesEspaco: modalidadesEspaco,
                                    horariosEspaco: horariosEspaco
                                }
                            })
                        }
                        endIcon={<EditIcon />}
                        sx={{
                            backgroundColor: "#F78B1F"
                        }}
                    >
                        Editar espaço
                    </Button>

                </div>
            </div>



        </div>
    )

}