import "./index.scss";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types'; // Para validação das props
import { useAuth } from "../../../Components/UserContext/AuthContext";
import { useState, useEffect } from "react"; // Adicione o useEffect aqui
import { buscar } from "../../../API/chamadas";
import { toast } from 'react-toastify';

import AlertDialog from "./AlertDialog";
import FormsReserva from "./FormsReserva";

export default function CardEquipe(params) {
    const navigate = useNavigate();
    const { modalidades } = useAuth();
    const { equipe, my } = params;
    const [vagasDisponiveis, setVagasDisponiveis] = useState(0);
    const [status, setStatus] = useState(null);
    const [open, setOpen] = useState(false);
    const [openForms, setOpenForms] = useState(false);
    const [description, setDescription] = useState(false);
    const [type, setType] = useState(false);


    // Função para buscar o número de participantes
    const buscarQtdParticipantes = async () => {
        try {
            if (equipe) {
                const participantes_da_equipe = await buscar(`participante/idEquipe/${equipe.idEquipe}`);
                setVagasDisponiveis(equipe.QtdMaxima - 1 - participantes_da_equipe.length);
            }
        } catch (error) {
            if (error.status === 404) {
                setVagasDisponiveis(equipe.QtdMaxima - 1);
            } else {
                toast.warning(error.status);
            }
        }
    };

    const buscarReservaEquipe = async () => {
        try {
            const reservaEquipe = await buscar(`reserva/idEquipe/${equipe.idEquipe}`);
            if (reservaEquipe) {
                setStatus(reservaEquipe[0].status);
            }
        } catch (error) {
            if (error.status === 404) {
                setStatus(null);
            } else {
                toast.warning(error.status);
            }
        }
    }

    // useEffect para buscar o número de participantes quando o componente for montado
    useEffect(() => {
        if (equipe) {
            buscarQtdParticipantes();
            buscarReservaEquipe();
        }
    }, [equipe]);

    // Verifica se a equipe foi passada corretamente
    if (!equipe) {
        return null;
    }

    const handleReservarEspaco = () => {
        // Envia os dados da equipe para o formulário de reserva
        // navigate('/FormularioReserva', { state: { equipe } });
        setOpenForms(true)
    };


    const handleClickOpen = (type) => {
        if (type === "sair_equipe") {
            setDescription("")
            setType("Sair da Equipe")
        } else if (type === "deletar_equipe") {
            setDescription("\n Deseja realmente deletar esta equipe?")
            setType("Deletar Equipe")
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false); // Atualiza o estado para fechar o diálogo
    };

    const handleCloseForms = () => {
        setOpenForms(false); // Atualiza o estado para fechar o diálogo
    };

    return (
        <div className="card_equipe" key={equipe.idEquipe}>
            <FormsReserva
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
                id={type === "Sair da Equipe" ? equipe.idParticipante : equipe.idEquipe}
                onActionCompleted={params.onDataChanged}
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
            <div>Equipe: {equipe.NomeEquipe}</div>
            <div className="extraContent">
                <p>Qtd jogadores até o momento</p>
                <h1>{equipe.QtdMaxima}</h1>
                <p>Qtd de vagas disponível</p>
                <h1>{vagasDisponiveis}</h1>
            </div>
            {my ? (
                <div className="acoes">
                    <button
                        onClick={handleReservarEspaco}
                        className={status === null
                            ? 'btn-success'
                            : status
                                ? 'btn-cancel'
                                : 'btn-pend'
                        }
                    >
                        {status === null
                            ? 'Reservar espaço'
                            : status
                                ? 'Cancelar Reserva'
                                : 'Reserva pendente'
                        }
                    </button>
                    <button className='btn-cancel' onClick={() => handleClickOpen("deletar_equipe")}>Deletar equipe</button>
                </div>
            ) : (
                <div className="acoes">
                    {/* Pensar em como buscar aqui o idParticipante deste vinculo equipe usuario */}
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
