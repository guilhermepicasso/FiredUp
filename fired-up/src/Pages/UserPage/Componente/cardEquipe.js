import "./index.scss";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types'; // Para validação das props
import { useAuth } from "../../../Components/UserContext/AuthContext";
import { useState, useEffect } from "react"; // Adicione o useEffect aqui
import { buscar } from "../../../API/chamadas";
import { toast } from 'react-toastify';

export default function CardEquipe(params) {
    const navigate = useNavigate();
    const { modalidades } = useAuth();
    const { equipe, my, onDeletarEquipe, onSairEquipe } = params;
    const [vagasDisponiveis, setVagasDisponiveis] = useState(0);
    const [status, setStatus] = useState(false)

    const deletarEquipe = async () => {
        try {
            await deletarEquipe(`equipe/${equipe.idEquipe}`);
        } catch (error) {
            toast.error("Erro ao tentar deletar equipe");
            console.log(error);
        }
    }

    const sairDaEquipe = async () => {
        // try {
        //     await deletarEquipe(`participante/${equipe.idEquipe}`);
        // } catch (error) {
        //     toast.error("Erro ao tentar deletar equipe");
        //     console.log(error);
        // }
    }

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

    // useEffect para buscar o número de participantes quando o componente for montado
    useEffect(() => {
        if (equipe) {
            buscarQtdParticipantes();
        }
    }, [equipe]);

    // Verifica se a equipe foi passada corretamente
    if (!equipe) {
        return null;
    }

    const handleReservarEspaco = () => {
        // Envia os dados da equipe para o formulário de reserva
        navigate('/FormularioReserva', { state: { equipe } });
    };

    return (
        <div className="card_equipe" key={equipe.idEquipe}>
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
                        className={status ? 'btn-cancel' : 'btn-success'}
                    >
                        {status ? 'Cancelar Reserva' : 'Reservar espaço'}
                    </button>
                    <button className='btn-cancel' onClick={() => deletarEquipe()}>Deletar equipe</button>
                </div>
            ) : (
                <div className="acoes">
                    {/* Pensar em como buscar aqui o idParticipante deste vinculo equipe usuario */}
                    <button className='btn-cancel' onClick={() => sairDaEquipe()}>Sair da equipe</button>
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
