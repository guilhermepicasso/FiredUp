import { useNavigate } from 'react-router-dom';
import './index.scss';

export default function CardModalidae(params) {
    const navigate = useNavigate();
    const handleNavigation = (modalidadeSelecionada) => {
        navigate('/Times'); //, { state: { modalidadesComTime, modalidadeSelecionada } }
    };
    return (
        <div className="cardModalidade" onClick={() => handleNavigation(params.id)} key={params.id} >
            <img src={params.img} alt={`Modalidade ${params.modalidade}`} />
            <p>{params.title}</p>
        </div>
    )
}