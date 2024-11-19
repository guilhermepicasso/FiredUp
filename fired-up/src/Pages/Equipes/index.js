import "./index.scss"

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { buscarEquipes, buscarModalidades } from '../../API/chamadas';
import { useAuth } from "../../Components/UserContext/AuthContext.js";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CardModalidae from '../../Components/CardModalidade';


export default function Equipes() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [equipes, setEquipes] = useState([]);
    const location = useLocation();
    const { id, img, modalidade } = location.state || {};
    const [selectedModalidade, setSelectedModalidade] = useState({
        id: id,
        img: img,
        modalidade: modalidade
    });
    const [modalidades, setModalidades] = useState([]);

    const handleButtonClick = () => {
        if (!isAuthenticated) {
            toast.warning(
                <div>
                    <div>Você precisa estar logado para criar uma equipe</div>
                    <button
                    style={{
                        backgroundColor: "var(--laranja-principal)",
                        border: "none",
                        marginTop: '4%',
                        padding: "2% 4%"
                    }}
                     onClick={() => {navigate("/Login"); toast.dismiss();}}
                     >Fazer login</button>
                </div>
            )
            return;
        } else {
            navigate("/FormularioEquipe");
        }
    };

    const handleChange = (event) => {
        // Filtra para encontrar a modalidade correspondente
        const value = event.target.value;
        if (value === "all") {
            filteredEquipes = equipes
            setSelectedModalidade({
                id: 'all',
                modalidade: 'Todos',
                img: null
            });
        } else {
            const modalidade = modalidades.find(mod => mod.idModalidade === Number(value));

            if (modalidade) {
                setSelectedModalidade({
                    id: modalidade.idModalidade,
                    modalidade: modalidade.Nome,
                    img: modalidade.Foto
                });
            }
        }
    };

    let filteredEquipes = equipes;

    if (selectedModalidade.modalidade !== 'all') {
        filteredEquipes = equipes.filter(equipe =>
            equipe.idModalidade === selectedModalidade.id
        );
    }

    useEffect(() => {
        const busca = async () => {
            try {
                const equipes = await buscarEquipes();
                const modalidades = await buscarModalidades();

                setModalidades(modalidades);
                setEquipes(equipes);
                console.log(equipes);
                
                console.log(modalidades);

            } catch (error) {
                console.log(error);
            }
        }
        busca();
    }, [])

    return (
        <div className="Equipes">
            <div className="opcao">
                <label>Lista de equipes na modalidade </label>
                <FormControl sx={{ m: 1, minWidth: 200, height: '20px' }}>
                    <Select
                        value={selectedModalidade.id}
                        onChange={handleChange}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        sx={{ height: '30px' }}
                    >
                        <MenuItem value="all">
                            <em>Todos</em>
                        </MenuItem>
                        {modalidades.map(modalidade => (
                            <MenuItem key={modalidade.idModalidade} value={modalidade.idModalidade}>{modalidade.Nome}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <button className="botaoEquipe" onClick={handleButtonClick}>Criar Equipe</button>
            </div>
            <div style={{ padding: '0 10%' }} className="listaEquipes">
                {filteredEquipes.map(equipe => (
                    // <div>{modalidades.find(m => m.idModalidade === 7)?.idModalidade} e {equipe.idModalidade}</div>
                    <CardModalidae id={equipe.idEquipe} img={modalidades.find(modalidade =>
                        modalidade.idModalidade === equipe.idModalidade)?.Foto} modalidade={modalidades.filter(modalidade =>
                            equipe.idModalidade === modalidade.idModalidade)?.Nome} equipe={equipe}></CardModalidae>
                ))}
            </div>
        </div>
    )
}