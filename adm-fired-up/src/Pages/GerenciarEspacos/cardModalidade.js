import "./index.scss"

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';

import DeleteIcon from '@mui/icons-material/Delete';
import { deletar } from "../../API/chamadas";

export default function CardModalidade(params) {

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
        <div className="card cardModalidade">
            <p className="cardTitle">{params.modalidade.Nome}</p>
            {params.editalvel && (
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