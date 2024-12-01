import "./index.scss"
import { useState } from 'react';
import { alterar, deletar } from "../../API/chamadas";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';

export default function CardItem(params) {
    const [editMode, setEditMode] = useState(null);
    const [editedItem, setEditedItem] = useState({});
    const handleChange = () => {

    }
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
            // Se o item já estiver em edição, desativa a edição
            const updatedItens = params.itens.map(item => {
                if (item.idItem === itemId) {
                    const updatedItem = {};

                    // Verificar cada campo e adicionar ao objeto apenas se houver mudança
                    if (editedItem.Nome !== item.Nome) {
                        updatedItem.Nome = editedItem.Nome;
                    }
                    if (editedItem.QtdTotal !== parseInt(item.QtdTotal, 10)) {
                        updatedItem.QtdTotal = parseInt(editedItem.QtdTotal, 10);
                    }
                    if (editedItem.QtdDisponivel !== parseInt(item.QtdDisponivel, 10)) {
                        updatedItem.QtdDisponivel = parseInt(editedItem.QtdDisponivel, 10);
                    }

                    // Se houver alterações, retorna o objeto com as mudanças
                    return Object.keys(updatedItem).length > 0 ? updatedItem : null;
                }

                // Se o item não for o editado, retorna ele sem alterações
                return item;
            }).filter(item => item !== null); // Filtra os nulls para manter apenas os itens alterados

            // Se não houver alterações, desative o EditMode
            if (updatedItens.length !== 0) {
                setEditMode(null); // Desativa o modo de edição
                try {
                    const result = await alterar({ tabela: "Item", id: itemId, body: updatedItens[0] });
                    console.log(result);
                    params.change("Item")
                } catch (error) {
                    console.log(error);
                }
            }
            setEditMode(null);
        } else {
            // Ativa a edição para o item
            setEditMode(itemId);
            const itemToEdit = params.itens.find(item => item.idItem === itemId);
            setEditedItem({
                Nome: itemToEdit.Nome,
                QtdTotal: itemToEdit.QtdTotal,
                QtdDisponivel: itemToEdit.QtdDisponivel,
            });
        }
    };

    const handleExcluir = (id, tabela) => {
        console.log(`chegou para excluir da tabela ${tabela} o id ${id}`);

        confirmAlert({
            title: 'Confirmar exclusão',
            message: 'Você tem certeza que deseja excluir esta reserva?',
            buttons: [
                {
                    label: 'Sim',
                    onClick: () => {
                        deletar({ tabela: tabela, id })
                            .then(() => {
                                toast.success('Exclusão realizada com sucesso!');
                                params.change(tabela)
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
        <section>
            <div className="cabecalho">
                <h2>Lista de {params.tipo}s</h2>
                <Button
                    variant="contained"
                    onClick={handleChange}
                    endIcon={<AddOutlinedIcon />}
                    sx={{
                        backgroundColor: "#F78B1F",  // Cor de fundo
                        '&:hover': {
                            backgroundColor: "#f17800", // Cor de fundo ao passar o mouse (hover)
                        }
                    }}
                >
                    Criar {params.tipo}
                </Button>
            </div>
            <div className="list">
                {params.itens.map((item) => (

                    <div key={item.idItem} className={`card ${params.tipo === "modalidade" ? 'cardModalidades' : 'cardItens'}`}>
                        <div>
                            {params.tipo !== "modalidade" ? (
                                editMode === item.idItem ? (
                                    <div className="cardContent contentInfo">
                                        <input
                                            type="text"
                                            value={editedItem.Nome}
                                            onChange={(e) => handleInputChange(e, 'Nome')}
                                        />
                                        <div>
                                            Qtd. total:
                                            <input
                                                type="number"
                                                value={editedItem.QtdTotal}
                                                onChange={(e) => handleInputChange(e, 'QtdTotal')}
                                            />
                                        </div>
                                        <div>
                                            Qtd. disponível:
                                            <input
                                                type="number"
                                                value={editedItem.QtdDisponivel}
                                                onChange={(e) => handleInputChange(e, 'QtdDisponivel')}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="cardContent contentInfo">
                                        <p className="cardTitle">{item.Nome}</p>
                                        <div>
                                            <p>Qtd. total: {item.QtdTotal}</p>
                                            <p>Qtd. disponível: {item.QtdDisponivel}</p>
                                        </div>
                                    </div>
                                )
                            ) : (
                                <div className="cardContent contentInfo">
                                    <p className="cardTitle">{item.Nome}</p>
                                </div>
                            )}
                        </div>
                        <div className="cardContent contentButtons">
                            <button
                                className="botao botaoExcluir"
                                onClick={() => {
                                    const id = params.tipo === "modalidade" ? item.idModalidade : item.idItem;
                                    const tipo = params.tipo === "modalidade" ? "modalidade" : "item";
                                    handleExcluir(id, tipo);
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </button>
                            {params.tipo !== "modalidade" && (
                                editMode === item.idItem ? (
                                    <button
                                        className="botao botaoEditar"
                                        onClick={() => handleEdit(item.idItem)}
                                    >
                                        <CheckIcon fontSize="small" />
                                    </button>

                                ) : (
                                    <button
                                        className="botao botaoEditar"
                                        onClick={() => handleEdit(item.idItem)}
                                    >
                                        <EditIcon fontSize="small" />
                                    </button>
                                )
                            )}

                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}