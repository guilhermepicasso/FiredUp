import { useNavigate } from 'react-router-dom';
import './index.scss';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { addParticipante, buscarParticipantes } from '../../API/chamadas.js';
import { useAuth } from '../../Components/UserContext/AuthContext.js'; // Importar useAuth

export default function CardModalidae(params) {
    const navigate = useNavigate();
    const [vagasDisponiveis, setVagasDisponiveis] = useState(0);
    const { user, isAuthenticated } = useAuth(); // Acesse o estado de autenticação

    const handleNavigation = (id, img, modalidade) => {
        navigate('/Equipes', { state: { id, img, modalidade } });
    };

    const buscarQtdParticipantes = async () => {
        try {
            const qtdParticipantes = await buscarParticipantes();
            
            const countParticipantes = qtdParticipantes.filter(participante =>
                participante.idEquipe === params.equipe.idEquipe
            );
            setVagasDisponiveis(params.equipe.QtdMaxima - countParticipantes.length);
        } catch (error) {
            console.log(error);
        }
    };

    const entrarPraEquipe = async () => {
        // Verifica se o usuário está autenticado
        console.log(user.RA);
        console.log(params.equipe.idResponsavel.toString());
        
        
        if (!isAuthenticated) {
            toast.warning("Você precisa estar logado para entrar na equipe!");
            return;
        } else if (params.equipe.idResponsavel.toString() === user.RA) {
            toast.warning("Você é o administrador desta equipe!");
            return;
        }
        try {
            await addParticipante({ usuario: parseInt(user.RA, 10) , idEquipe: params.equipe.idEquipe });
            buscarQtdParticipantes();
        } catch (error) {
            console.error("Erro ao entrar pra equipe:", error);
        }
    };

    useEffect(() => {
        if (params.equipe) {
            buscarQtdParticipantes();
        }
    }, [params.equipe]);

    return (
        <div className="cardModalidade" onClick={() => handleNavigation(params.id, params.img, params.modalidade)} key={params.id}>
            <img src={params.img} alt={`Modalidade ${params.modalidade}`} />
            <p>{params.modalidade}</p>
            {params.equipe ? (
                <div className="extraContent">
                    <p>Qtd jogadores até o momento</p>
                    <h1>{params.equipe.QtdMaxima}</h1>
                    <p>Qtd de vagas disponível</p>
                    <h1>{vagasDisponiveis}</h1>
                    <button 
                        style={{ opacity: vagasDisponiveis === 0 ? 0.5 : 1 }}
                        disabled={vagasDisponiveis === 0} 
                        onClick={() => entrarPraEquipe()}
                    > {vagasDisponiveis === 0 ? "Equipe completa" : "Entrar pra equipe"}</button>
                </div>
            ) : null}
        </div>
    );
}
