import "./index.scss"
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { buscar } from "../../API/chamadas";
import Button from '@mui/material/Button';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CardEspaco from "./cardEspaco";
import CancelIcon from '@mui/icons-material/Cancel';
// import modalidadesJson from '../../../public/modalidades.json'

import 'react-confirm-alert/src/react-confirm-alert.css';
import CardItem from "./cardItem";
import CardModalidade from "./cardModalidade";
import Dialog from '@mui/material/Dialog';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function GerenciarEspaco() {
    const [itens, setItens] = useState([]);
    const [modalidades, setModalidades] = useState([]);
    const [espacos, setEspacos] = useState([]);

    const [isCreating, setIsCreating] = useState(false);

    // Novo estado para armazenar informações de cada espaço separadamente
    const [dadosEspacos, setDadosEspacos] = useState({});

    const change = async (tabela, id) => {
        try {
            const result = await buscar((tabela === "Modalidade" || tabela === "Item" || tabela === "Espaco") ? tabela : `${tabela}/idEspaco/${id}`)
            if (tabela === "Item") {
                setItens(result);
            } else if (tabela === "Modalidade") {
                setModalidades(result)
            } else if (tabela === "ItemEspaco") {
                setDadosEspacos(prevState => ({
                    ...prevState,
                    [id]: {
                        ...prevState[id],
                        itensEspaco: result.map(item => {
                            // Encontra o nome correspondente do item na lista de itens
                            const itemCorrespondente = itens.find(it => it.idItem === item.idItem);
                            return itemCorrespondente;
                            // id: item.idItemEspaco,  // Id do espaço da modalidade
                            // Nome: itemCorrespondente ? itemCorrespondente.Nome : "Nome não encontrado"  // Usa o Nome correspondente

                        })
                    }
                }));
            } else if (tabela === "ModalidadeEspaco") {
                setDadosEspacos(prevState => ({
                    ...prevState,
                    [id]: {
                        ...prevState[id],
                        modalidadesEspaco: result.map(item => {
                            // Encontra o nome correspondente do item na lista de itens
                            const itemCorrespondente = modalidades.find(it => it.idModalidade === item.idModalidade);
                            return {
                                id: item.idModalidadeEspaco,  // Id do espaço da modalidade
                                Nome: itemCorrespondente ? itemCorrespondente.Nome : "Nome não encontrado"  // Usa o Nome correspondente
                            };
                        })
                    }
                }));
            } else if (tabela === "HorarioFuncionamento") {
                setDadosEspacos(prevState => ({
                    ...prevState,
                    [id]: {
                        ...prevState[id],
                        horariosEspaco: result // Armazena horários para cada espaço
                    }
                }));
            } else if (tabela === "Espaco") {
                setEspacos(result);
            }
        } catch (error) {
            if (error.status !== 404) {
                console.log("erro ao buscar dados: ", error);
            }
        }
    }

    const fetchDadosEspaco = async () => {
        await change("Espaco");
        for (let espaco of espacos) {
            await Promise.all([
                change("ItemEspaco", espaco.idEspaco),
                change("ModalidadeEspaco", espaco.idEspaco),
                change("HorarioFuncionamento", espaco.idEspaco)
            ]);
        }
    };




    const fetchEspacosData = async () => {
        await Promise.all([
            change("Item"),
            change("Modalidade"),
            change("Espaco")
        ]);

        // Agora, para cada espaço, busca as informações específicas
        for (let espaco of espacos) {
            await Promise.all([
                change("ItemEspaco", espaco.idEspaco),
                change("ModalidadeEspaco", espaco.idEspaco),
                change("HorarioFuncionamento", espaco.idEspaco)
            ]);
        }
    };

    // Buscar dados ao carregar
    useEffect(() => {
        fetchEspacosData();
    }, []);

    const handleChangeItens = () => {
        if (isCreating) {
            // Se o botão for "Cancelar", remove o último item vazio da lista
            setItens(itens.filter(item => item.Nome !== ""));
        } else {
            // Adiciona um novo item vazio à lista
            setItens([
                ...itens,
                {
                    idItem: uuidv4(),
                    Nome: "", // Nome vazio
                    QtdTotal: "",
                    QtdDisponivel: "",
                }
            ]);
        }
        setIsCreating(!isCreating);  // Alterna entre os estados "Criar" e "Cancelar"
    };

    const handleChangeModalidade = () => {

    }

    const [open, setOpen] = useState(false);
    const [age, setAge] = useState('');
    const onClose = () => {
        setOpen(false);
    }

    const handleChange = (event) => {
        setAge(event.target.value);
    };


    return (
        <div className="GerenciarEspaco">
            <Header />
            <Dialog
                open={open}
                onClose={onClose}
            >
                <div style={{ padding: "2vw" }}>
                    <h1>Adicionar nova modalidade</h1>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Modalidade</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={age}
                                label="Modalidade"
                                onChange={handleChange}
                            >
                                {/* {modalidadesJson.map(modalidade => (
                                    <MenuItem value={modalidade.id}>{modalidade.modalidade}</MenuItem>
                                ))} */}
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                            <div>
                                <Button
                                    variant="contained"
                                    onClick={handleChangeItens}
                                >
                                    Salvar
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </FormControl>
                    </Box>
                </div>
            </Dialog>
            <h1>Gerenciar espaço</h1>
            <div className="content">
                <section>
                    <div className="cabecalho">
                        <h2>Lista de itens</h2>
                        <Button
                            variant="contained"
                            onClick={handleChangeItens}
                            endIcon={isCreating ? <CancelIcon /> : <AddOutlinedIcon />}
                            sx={{
                                backgroundColor: isCreating ? "red" : "#F78B1F"
                            }}
                        >
                            {isCreating ? "Cancelar" : "Criar Item"}
                        </Button>
                    </div>
                    <div className="list">
                        {itens.map((item) => (

                            <CardItem key={item.idItem} item={item} />
                        ))}
                    </div>
                </section>

                <section>
                    <div className="cabecalho">
                        <h2>Lista de modalidades</h2>
                        <Button
                            variant="contained"
                            onClick={() => setOpen(true)}
                            endIcon={<AddOutlinedIcon />}
                            sx={{
                                backgroundColor: "#F78B1F",  // Cor de fundo
                                '&:hover': {
                                    backgroundColor: "#f17800", // Cor de fundo ao passar o mouse (hover)
                                }
                            }}
                        >
                            Criar Modalidade
                        </Button>
                    </div>
                    <div className="list">
                        {modalidades.map((modalidade) => (
                            <CardModalidade modalidade={modalidade} editalvel={true} />
                        ))}
                    </div>
                </section>

                <section>
                    <div className="cabecalho">
                        <h2>Lista de espaços</h2>
                        <Button
                            variant="contained"
                            onClick={handleChangeModalidade}
                            endIcon={<AddOutlinedIcon />}
                            sx={{
                                backgroundColor: "#F78B1F",  // Cor de fundo
                                '&:hover': {
                                    backgroundColor: "#f17800", // Cor de fundo ao passar o mouse (hover)
                                }
                            }}
                        >
                            Criar espaço
                        </Button>
                    </div>
                    <div className="list">
                        {espacos.map((espaco) => (
                            <CardEspaco espaco={espaco} itens={itens} modalidades={modalidades} />
                        ))}
                    </div>
                </section>

            </div>
            <Footer />
        </div>
    );
}

export default GerenciarEspaco;
