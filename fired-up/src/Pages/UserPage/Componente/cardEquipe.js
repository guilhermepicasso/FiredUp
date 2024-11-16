import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types'; // Para validação das props

export default function CardEquipe(params) {
    const navigate = useNavigate();
    const { equipe, my, onDeletarEquipe, onSairEquipe } = params;

    // Verifica se a equipe foi passada corretamente
    if (!equipe) {
        return null;
    }

    const handleReservarEspaco = () => {
        // Envia os dados da equipe para o formulário de reserva
        navigate('/FormularioReserva', { state: { equipe } });
    }

    return (
        <div className="card_equipe" key={equipe.idEquipe}>
            <div>{equipe.NomeEquipe}</div>
            {my ? (
                <div>
                    <button onClick={() => onDeletarEquipe(equipe.idEquipe)}>Deletar equipe</button>
                    <button onClick={handleReservarEspaco}>
                        Reservar espaço
                    </button>
                </div>
            ) : (
                <button onClick={() => onSairEquipe(equipe.idEquipe)}>Sair da equipe</button>
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
    onDeletarEquipe: () => {},
    onSairEquipe: () => {},
};
