import { useState } from "react";
import "./index.scss";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { alterar, criar, deletar } from "../../API/chamadas";

export default function CardItem(params) {
    const [editMode, setEditMode] = useState(null);
    const [editedItem, setEditedItem] = useState({});

    const handleCardClick = () => {
        if (params.isClickable) {
            params.onSelectItem(params.item.idItem); // Chama a função de callback recebida como prop
        }
    };

    const handleInputChange = (e, field) => {
        const value = e.target.value;

        // Garantir que os valores de QtdTotal e QtdDisponivel sejam inteiros
        if (field === 'QtdTotal' || field === 'QtdDisponivel') {
            const intValue = parseInt(value, 10);
            setEditedItem({
                ...editedItem,
                [field]: isNaN(intValue) ? '' : intValue, // Caso o valor seja inválido, manter em branco
            });
        } else {
            setEditedItem({
                ...editedItem,
                [field]: value,
            });
        }
    };

    // Função que ativa/desativa o modo de edição
    const handleEdit = async (itemId) => {
        if (editMode === itemId) {
            const updatedItem = {};

            // Verifica as alterações em cada campo e adiciona ao objeto se houver mudança
            if (editedItem.Nome !== params.item.Nome) {
                updatedItem.Nome = editedItem.Nome;
            }

            if (editedItem.QtdTotal !== parseInt(params.item.QtdTotal, 10)) {
                updatedItem.QtdTotal = parseInt(editedItem.QtdTotal, 10);
            }
            if (editedItem.QtdDisponivel !== parseInt(params.item.QtdDisponivel, 10)) {
                updatedItem.QtdDisponivel = parseInt(editedItem.QtdDisponivel, 10);
            }

            // Se houver alterações, chama a função alterar
            if (Object.keys(updatedItem).length > 0) {
                try {
                    await alterar({ tabela: "Item", id: itemId, body: updatedItem });
                    params.item.Nome = editedItem.Nome;
                    params.item.QtdTotal = editedItem.QtdTotal;
                    params.item.QtdDisponivel = editedItem.QtdDisponivel;
                    toast.success("Item editado com sucesso!");
                } catch (error) {
                    toast.error("Erro ao editar item!");
                }
            }
            // Desativa o modo de edição após salvar ou se não houver mudanças
            setEditMode(null);
        } else {
            // Ativa a edição para o item
            setEditMode(itemId);
            setEditedItem({
                Nome: params.item.Nome || '',
                QtdTotal: params.item.QtdTotal || '',
                QtdDisponivel: params.item.QtdDisponivel || '',
            });
        }
    };

    const handleExcluir = (id) => {
        confirmAlert({
            title: 'Confirmar exclusão',
            message: 'Você tem certeza que deseja excluir esta reserva?',
            buttons: [
                {
                    label: 'Sim',
                    onClick: () => {
                        deletar({ tabela: "item", id })
                            .then(() => {
                                toast.success('Exclusão realizada com sucesso!');
                                params.change("Item");
                            })
                            .catch((error) => {
                                toast.error(`Erro ao excluir: ${error}`);
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
            className={`card cardItem ${params.isClickable ? "clicavel" : ""} ${params.isSelected ? "selecionado" : ""}`}
            onClick={params.isClickable ? handleCardClick : undefined}
        >
            {editMode === params.item.idItem || params.item.Nome === "" ? (
                <div className="cardContent contentInfo">
                    <input
                        type="text"
                        value={editedItem.Nome}
                        onChange={(e) => handleInputChange(e, 'Nome')}
                        placeholder="Nome do item"
                    />
                    <div>
                        Qtd. total:
                        <input
                            type="number"
                            value={editedItem.QtdTotal}
                            onChange={(e) => handleInputChange(e, 'QtdTotal')}
                            placeholder="Quantidade total"
                        />
                    </div>
                    {params.item.Nome === "" ? (
                        <div>
                            Qtd. disponível:
                            <input
                                type="number"
                                value={editedItem.QtdTotal}
                                onChange={(e) => handleInputChange(e, 'QtdDisponivel')}
                                placeholder="Quantidade disponível"
                            />
                        </div>
                    ) : (
                        <div>
                            Qtd. disponível:
                            <input
                                type="number"
                                value={editedItem.QtdDisponivel}
                                onChange={(e) => handleInputChange(e, 'QtdDisponivel')}
                                placeholder="Quantidade disponível"
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div className="cardContent contentInfo">
                    <p className="cardTitle">{params.item.Nome}</p>
                    <div>
                        <p>Qtd. total: {params.item.QtdTotal}</p>
                        <p>Qtd. disponível: {params.item.QtdDisponivel}</p>
                    </div>
                </div>
            )}
            {/* Esconde os botões se isClickable for true */}
            {!params.isClickable && (
                <div className="cardContent contentButtons">
                    {params.item.Nome === "" ? (
                        <button
                            className="botao botaoEditar"
                            onClick={() => {
                                const body = { Nome: editedItem.Nome, QtdTotal: editedItem.QtdTotal, QtdDisponivel: editedItem.QtdTotal };
                                criar({ tabela: "item", body: body })
                                    .then(() => {
                                        toast.success('Item salvo com sucesso!');
                                    })
                                    .catch((error) => {
                                        toast.error(`Erro ao salvar: ${error}`);
                                    });
                            }}
                        >
                            <CheckIcon fontSize="small" />
                        </button>
                    ) : (
                        <>
                            <button
                                className="botao botaoExcluir"
                                onClick={() => {
                                    handleExcluir(params.idItem);
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </button>
                            {editMode === params.item.idItem ? (
                                <button
                                    className="botao botaoEditar"
                                    onClick={() => handleEdit(params.item.idItem)}
                                >
                                    <CheckIcon fontSize="small" />
                                </button>
                            ) : (
                                <button
                                    className="botao botaoEditar"
                                    onClick={() => handleEdit(params.item.idItem)}
                                >
                                    <EditIcon fontSize="small" />
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}