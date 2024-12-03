import "./index.scss"

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';

import DeleteIcon from '@mui/icons-material/Delete';
import { deletar } from "../../API/chamadas";

export default function CardModalidade(params) {

    const handleCardClick = () => {
        if (params.isClickable) {
            params.onSelectModalidade(params.modalidade.idModalidade);
        }
    };

    const handleExcluir = (id) => {
        confirmAlert({
            title: 'Confirmar exclusão',
            message: 'Você tem certeza que deseja excluir esta Modalidade?',
            buttons: [
                {
                    label: 'Sim',
                    onClick: () => {
                        deletar({ tabela: "modalidade", id })
                            .then(() => {
                                toast.success('Modalidade excluida com sucesso!');
                                params.change("Modalidade")
                            })
                            .catch((error) => {
                                toast.error(`Erro ao excluir modalidade: ${error}`);
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


    return (
        <div
            className={`card cardModalidade ${params.isClickable ? "clicavel" : ""} ${params.isSelected ? "selecionado" : ""}`}
            onClick={params.isClickable ? handleCardClick : undefined}
        >
            <p className="cardTitle">{params.modalidade.Nome}</p>
            {(!params.isClickable && params.editalvel) && ( 
                <div className="cardContent contentButtons">
                    <button
                        className="botao botaoExcluir"
                        onClick={() => {
                            handleExcluir(params.modalidade.idModalidade);
                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </button>
                </div>
            )}
        </div>
    )
}