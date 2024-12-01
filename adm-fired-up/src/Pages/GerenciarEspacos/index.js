import "./index.scss"
import { useEffect, useState } from 'react';
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { alterar, buscar, deletar } from "../../API/chamadas";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CardEspaco from "./cardEspaco";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import CardItem from "./cardItem";

function GerenciarEspaco() {
    const [itens, setItems] = useState([]);
    const [modalidades, setModalidades] = useState([]);
    const [espacos, setEspacos] = useState([]);
    const [editItem, setEditItem] = useState(false);
    const [editMode, setEditMode] = useState(null);
    const [editedItem, setEditedItem] = useState({});


    const handleChange = () => {

    }

    const handleExcluir = (id, tabela) => {
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
                                if (tabela === "Item") {
                                    setItems((prevItens) => prevItens.filter((res) => res.idItem !== id));
                                } else if ("Modalidade") {
                                    setModalidades((prevModalidades) => prevModalidades.filter((res) => res.idModalidade !== id));
                                } else if (tabela === "espaco") {
                                    setEspacos((prevEspacos) => prevEspacos.filter((res) => res.idEspaco !== id));
                                }
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

    const change = async (tabela) => {
        try {
            const itens = await buscar(tabela)
            if (tabela === "Item") {
                setItems(itens);
            } else if (tabela === "Modalidade") {
                setModalidades(itens)
            } else {
                setEspacos(itens)
            }
        } catch (error) {
            if (error.status !== 404) {
                console.log("erro ao buscar dados: ", error);
            }
        }
    }

    useEffect(() => {
        change("Item");
        change("Modalidade");
        change("Espaco");
    }, [])

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
            const updatedItens = itens.map(item => {
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
                    change("Item")
                } catch (error) {
                    console.log(error);
                }
            }
            setEditMode(null);
        } else {
            // Ativa a edição para o item
            setEditMode(itemId);
            const itemToEdit = itens.find(item => item.idItem === itemId);
            setEditedItem({
                Nome: itemToEdit.Nome,
                QtdTotal: itemToEdit.QtdTotal,
                QtdDisponivel: itemToEdit.QtdDisponivel,
            });
        }
    };

    return (
        <div className="GerenciarEspaco">
            <Header />
            <h1>Gerenciar espaço</h1>
            <div className="content">
                <CardItem change={change} itens={itens} tipo={"itens"} />
                <CardItem change={change} itens={modalidades} tipo={"modalidades"} />

                <section>
                    <div className="cabecalho">
                        <h2>Lista de Espaços</h2>
                        <Button variant="contained" onClick={handleChange}>
                            Adicionar Espaço <AddOutlinedIcon />
                        </Button>
                    </div>
                    <div className="list">
                        {espacos.map((espaco, key) => (
                            <CardEspaco itens={itens} modalidades={modalidades} espaco={espaco}></CardEspaco>
                        ))}
                    </div>
                </section>

            </div>
            <Footer />
        </div>
    );
}

export default GerenciarEspaco;