import "./index.scss";
import PropTypes from 'prop-types'; // Para validação das props
import { useAuth } from "../../../Components/UserContext/AuthContext";
import { useState, useEffect } from "react"; // Adicione o useEffect aqui
import { buscar } from "../../../API/chamadas";
import { toast } from 'react-toastify';

import AlertDialog from "./AlertDialog";
import FormsReserva from "./FormsReserva";

export default function CardEquipe(params) {
    const { modalidades } = useAuth();
    const { equipe, my } = params;
    const [vagasDisponiveis, setVagasDisponiveis] = useState(0);
    const [dadosReserva, setDadosReserva] = useState({});
    const [open, setOpen] = useState(false);
    const [openForms, setOpenForms] = useState(false);
    const [description, setDescription] = useState(false);
    const [type, setType] = useState(false);


    // Função para buscar o número de participantes
    const buscarQtdParticipantes = async () => {
        try {
            if (equipe) {
                const participantes_da_equipe = await buscar(`participante/idEquipe/${equipe.idEquipe}`);
                const vagas = equipe.QtdMaxima - 1 - participantes_da_equipe.length;
                if (vagas !== vagasDisponiveis) {  // Só atualiza se o valor mudou
                    setVagasDisponiveis(vagas);
                }
            }
        } catch (error) {
            if (error.status === 404) {
                const vagas = equipe.QtdMaxima - 1;
                if (vagas !== vagasDisponiveis) {
                    setVagasDisponiveis(vagas);
                }
            } else {
                toast.warning(error.status);
            }
        }
    };


    const buscarReservaEquipe = async () => {
        try {
            const reservaEquipe = await buscar(`reserva/idEquipe/${equipe.idEquipe}`);
            if (reservaEquipe) {
                setDadosReserva(reservaEquipe[0]);
            }
            console.log("ok em buscarReservaEquipe");
        } catch (error) {
            if (error.status === 404) {
                setDadosReserva({
                    ...dadosReserva,
                    status: null
                });
            } else {
                toast.warning(error.status);
            }
        }
    }

    // useEffect para buscar o número de participantes quando o componente for montado
    useEffect(() => {
        if (equipe && !dadosReserva.status) {  // Verifica se o status não foi carregado
            buscarQtdParticipantes();
            buscarReservaEquipe();
        }
    }, [equipe, dadosReserva.status]);

    // Verifica se a equipe foi passada corretamente
    if (!equipe) {
        return null;
    }

    const handleReservarEspaco = () => {
        setOpenForms(true)
    };

    const converterData = (data) => {
        const newDate = new Date(data);
        return newDate.toLocaleDateString('pt-BR');
    }

    const handleClickOpen = (type) => {
        if (type === "sair_equipe") {
            setDescription("")
            setType("Sair da Equipe")
        } else if (type === "deletar_equipe") {
            setDescription("\n Deseja realmente deletar esta equipe?")
            setType("Deletar Equipe")
        } else if (type === "cancelar_reserva") {
            setDescription("\n Deseja realmente cancelar esta reserva?")
            setType("Cancelar Reserva")
        }
        setOpen(true);
    };

    const handleClose = async () => {
        setOpen(false); // Atualiza o estado para fechar o diálogo
        if (type === "cancelar_reserva" || type === "deletar_equipe") {
            await buscarQtdParticipantes(); // Recarregar as vagas
            await buscarReservaEquipe(); // Recarregar a reserva da equipe
        }
    };

    const handleCloseForms = () => {
        setOpenForms(false); // Atualiza o estado para fechar o diálogo
    };

    return (
        <div className="card_equipe" key={equipe.idEquipe}>
            <FormsReserva
                modalidade={modalidades.find(modalidade => modalidade.idModalidade === equipe.idModalidade)?.idModalidade}
                reserva={dadosReserva.status !== null ? dadosReserva : null}
                equipe={equipe}
                open={openForms}
                onClose={handleCloseForms}
                onActionCompleted={params.onDataChanged}
            />
            <AlertDialog
                open={open}
                description={description}
                button={type}
                onClose={handleClose}
                id={type === "Sair da Equipe" ? equipe.idParticipante : type === "Deletar Equipe" ? equipe.idEquipe : dadosReserva.idReserva}
                onActionCompleted={async () => {
                    await buscarQtdParticipantes();
                    await buscarReservaEquipe();
                    if (params.onDataChanged) {
                        params.onDataChanged(); 
                    }
                }}
            />
            <div className="modalidade">
                <div className="img_modalidade">
                    <img
                        src={modalidades.find(modalidade => modalidade.idModalidade === equipe.idModalidade)?.Foto}
                        alt={`Modalidade`}
                    />
                </div>
                <p>{modalidades.find(modalidade => modalidade.idModalidade === equipe.idModalidade)?.Nome}</p>
            </div>
            <div>
                <p>{equipe.NomeEquipe}</p>
                {(dadosReserva.status === 1 || dadosReserva.status === 0) &&
                    <div className="reserva">
                        <p className="titulo">Dados da reserva</p>
                        <p>Espaço: {dadosReserva.idEspaco}</p>
                        <p>Dia: {converterData(dadosReserva.DataReserva)}</p>
                        <p>Inicio: {dadosReserva.HoraInicio.slice(0, 5)}</p>
                    </div>
                }
            </div>
            <div className="extraContent">
                <p>Qtd jogadores até o momento</p>
                <h1>{equipe.QtdMaxima}</h1>
                <p>Qtd de vagas disponível</p>
                <h1>{vagasDisponiveis}</h1>
            </div>
            {my ? (
                <div className="acoes">
                    <button
                        onClick={() => dadosReserva.status === null ? handleReservarEspaco() : null}
                        className={dadosReserva.status === null
                            ? 'btn-success'
                            : dadosReserva.status === 0
                                ? 'btn-pend'
                                : 'btn-auth'
                        }
                    >
                        {dadosReserva.status === null
                            ? 'Reservar espaço'
                            : dadosReserva.status === 0
                                ? 'Reserva pendente'
                                : 'Reserva Autorizada'
                        }
                    </button>
                    <button
                    className='btn-cancel'
                    onClick={() => {
                        if (dadosReserva.status === null) {
                            handleClickOpen("deletar_equipe");  // Se status for null, abre "Deletar Equipe"
                        } else {
                            handleClickOpen("cancelar_reserva"); // 0 ou 1, abre "Cancelar Reserva"
                        }
                    }}
                >
                    {dadosReserva.status === null
                        ? 'Deletar Equipe'  // Para Status null, "Deletar Equipe"
                        : 'Cancelar Reserva'  // Para Status 0 ou 1, "Cancelar Reserva"
                    }
                </button>
                </div>
            ) : (
                <div className="acoes">
                    <button className='btn-cancel' onClick={() => handleClickOpen("sair_equipe")}>Sair da equipe</button>
                </div>
            )}
        </div>
    );
}

// Validação das props com PropTypes
CardEquipe.propTypes = {
    params: PropTypes.shape({
        equipe: PropTypes.shape({
            idEquipe: PropTypes.number.isRequired,
            NomeEquipe: PropTypes.string.isRequired,
        }).isRequired,
        my: PropTypes.bool.isRequired,
        onDeletarEquipe: PropTypes.func,
        onSairEquipe: PropTypes.func,
    }).isRequired,
};

// Definição de props padrão
CardEquipe.defaultProps = {
    onDeletarEquipe: () => { },
    onSairEquipe: () => { },
};
