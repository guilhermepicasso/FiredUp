import "./index.scss"
import { useEffect, useState } from 'react';
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { buscar } from "../../API/chamadas";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CardEspaco from "./cardEspaco";

function GerenciarEspaco() {
    const [items, setItems] = useState([]);
    const [modalidades, setModalidades] = useState([]);
    const [espacos, setEspacos] = useState([]);


    const handleChange = () => {

    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const items = await buscar("item")
                setItems(items);
            } catch (error) {
                console.log("erro ao buscar itens: ", error);
            }
            try {
                const modalidades = await buscar("Modalidade")
                setModalidades(modalidades);
            } catch (error) {
                console.log("erro ao buscar modalidades: ", error);
            }
            try {
                const espacos = await buscar("Espaco")
                setEspacos(espacos);
            } catch (error) {
                console.log("erro ao buscar espaços: ", error);
            }
        }
        fetchData();
    }, [])

    return (
        <div className="GerenciarEspaco">
            <Header />
            <div className="content">
                <h1>Gerenciar espaço</h1>
                <section>
                    <div className="cabecalho">
                        <h2>Lista de items</h2>
                        <Button variant="contained" onClick={handleChange}>
                            Adicionar Item <AddOutlinedIcon />
                        </Button>
                    </div>
                    <div className="list">
                        {items.map((item, key) => (
                            <div key={key} className="card cardItens">
                                <div className="cardContent contentInfo">
                                    <p>{item.Nome}</p>
                                    <p>Qtd. total:{item.QtdTotal}</p>
                                    <p>Qtd. disponível:{item.QtdDisponivel}</p>
                                </div>
                                <div className="cardContent contentButtons">
                                    <button>
                                        <DeleteIcon fontSize="small" />
                                    </button>
                                    <button>
                                        <EditIcon fontSize="small" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <div className="cabecalho">
                        <h2>Lista de Modalidades</h2>
                        <Button variant="contained" onClick={handleChange}>
                            Adicionar Modalidade <AddOutlinedIcon />
                        </Button>
                    </div>
                    <div className="list">
                        {modalidades.map((modalidade, key) => (
                            <div key={key} className="card cardItens">
                                <div className="cardContent contentInfo">
                                    <p>{modalidade.Nome}</p>
                                </div>
                                <div className="cardContent contentButtons">
                                    <button>
                                        <DeleteIcon fontSize="small" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <div className="cabecalho">
                        <h2>Lista de Espaços</h2>
                        <Button variant="contained" onClick={handleChange}>
                            Adicionar Espaço <AddOutlinedIcon />
                        </Button>
                    </div>
                    <div className="list">
                        {espacos.map((espaco, key) => (
                            <CardEspaco espaco={espaco}></CardEspaco>
                        ))}
                    </div>
                </section>

            </div>
            <Footer />
        </div>
    );
}

export default GerenciarEspaco;