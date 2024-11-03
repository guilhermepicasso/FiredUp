import { useNavigate } from 'react-router-dom';
import './index.scss';
import { useEffect, useState } from 'react';
import { addParticipante, buscarParticipantes } from '../../API/chamadas';

export default function CardModalidae(params) {
    const navigate = useNavigate();
    const [qtdParticipantes, setQtdParticipantes] = useState(0);

    const handleNavigation = (id, img, modalidade) => {
        navigate('/Times', { state: { id, img, modalidade } });
    };

    const buscarQtdParticipantes = async () => {
        try {
            const qtdParticipantes = await buscarParticipantes();
            
            const countParticipantes = qtdParticipantes.filter(participante =>
                participante.idEquipe === params.equipe.idEquipe
            );
            setQtdParticipantes(countParticipantes.length);
        } catch (error) {
            console.log(error);
        }
    }

    const entrarProTime = async (idUsuario) => {
        try {
            await addParticipante({ usuario: idUsuario, idEquipe: params.equipe.idEquipe});
            buscarQtdParticipantes(); // Recarrega a quantidade após entrar
        } catch (error) {
            console.error("Erro ao entrar no time:", error);
        }
    };

    useEffect(() => {
        if (params.equipe) {
            buscarQtdParticipantes();
        }
    }, [params.equipe]);

    return (
        <div className="cardModalidade" onClick={() => handleNavigation(params.id, params.img, params.modalidade)} key={params.id} >
            <img src={params.img} alt={`Modalidade ${params.modalidade}`} />
            <p>{params.modalidade}</p>
            {params.equipe ? (
                <div className="extraContent">
                    {/* Conteúdo que aparece quando QtdMaxima está presente */}
                    <p>Qtd jogadores até o momento</p>
                    <h1>{params.equipe.QtdMaxima}</h1>
                    <p>Qtd de vagas disponivel</p>
                    <h1>{params.equipe.QtdMaxima - qtdParticipantes}</h1>
                    <button onClick={() => entrarProTime("432516")}>Entrar pro time</button>
                </div>
            ) : null}
        </div>
    )
}