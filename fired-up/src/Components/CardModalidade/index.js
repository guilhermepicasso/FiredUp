import { useNavigate } from 'react-router-dom';
import './index.scss';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { buscar, create } from '../../API/chamadas';
import { useAuth } from '../../Components/UserContext/AuthContext.js';

export default function CardModalidae(params) {
    const navigate = useNavigate();
    const [vagasDisponiveis, setVagasDisponiveis] = useState(0);
    const { user, isAuthenticated } = useAuth();

    const handleNavigation = (modalidade) => {
        navigate('/Equipes', { state: { modalidade } });
    };

    const buscarQtdParticipantes = async () => {
        try {
            const participantes_da_equipe = await buscar(`participante/idEquipe/${params.equipe.idEquipe}`)
            setVagasDisponiveis(params.equipe.QtdMaxima - 1 - participantes_da_equipe.length);
        } catch (error) {
            if (error.status === 404) {
                setVagasDisponiveis(params.equipe.QtdMaxima - 1)
            } else {
                toast.warning(error.status)
            }
        }
    };

    const entrarPraEquipe = async () => {
        if (!isAuthenticated) {
            toast.warning("Você precisa estar logado para entrar na equipe!");
            return;
        } else if (params.equipe.idResponsavel.toString() === user.RA) {
            toast.warning("Você é o administrador desta equipe!");
            return;
        }
        try {
            const body = {
                "idUsuario": parseInt(user.RA, 10),
                "idEquipe": params.equipe.idEquipe,
                "DataEntrada": new Date().toISOString().split('T')[0]
            };
            await create("participante", body);
            toast.success(`Agora você participa da equipe de ${params.modalidade.Nome}`);
            buscarQtdParticipantes();
        } catch (error) {
            if (error.status === 401) {
                toast.error("Você já faz parte desta equipe!")
            } else {
                console.error("Erro ao entrar pra equipe:", error);
            }
        }
    };

    useEffect(() => {
        if (params.equipe) {
            buscarQtdParticipantes();
        }
    }, [params.equipe]);

    return (
        <div
            className={`cardModalidade ${params.equipe && 'equipeExistente'}`}
            onClick={() => handleNavigation(params.modalidade)}
            key={params.modalidade.idModalidade}
            style={{ cursor: params.equipe ? 'default' : 'pointer' }}
        >
            <img src={params.modalidade.Foto} alt={`Modalidade ${params.modalidade.Nome}`} />
            {params.equipe ? 
                <p>{params.equipe.NomeEquipe}</p>
             :
                <p>{params.modalidade.Nome}</p>
            }
            {params.equipe ? (
                <div className="extraContent">
                    <p>Qtd jogadores até o momento</p>
                    <h1>{params.equipe.QtdMaxima}</h1>
                    <p>Qtd de vagas disponível</p>
                    <h1>{vagasDisponiveis}</h1>
                    <button
                        style={{ opacity: vagasDisponiveis <= 0 ? 0.5 : 1 }}
                        disabled={vagasDisponiveis <= 0}
                        onClick={() => entrarPraEquipe()}
                    > {vagasDisponiveis <= 0 ? "Equipe completa" : "Entrar pra equipe"}</button>
                </div>
            ) : null}
        </div>
    );
}
