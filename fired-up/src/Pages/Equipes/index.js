import "./index.scss";

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { buscar } from '../../API/chamadas';
import { useAuth } from "../../Components/UserContext/AuthContext.js";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CardModalidae from '../../Components/CardModalidade';
import Header from "../../Components/Header/index.js";

export default function Equipes() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [equipes, setEquipes] = useState([]);
    const location = useLocation();
    const { modalidade } = location.state || {};
    const [selectedModalidade, setSelectedModalidade] = useState(modalidade ? modalidade.idModalidade : "all");
    const [modalidades, setModalidades] = useState([]);
    const [filteredEquipes, setFilteredEquipes] = useState([]);

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
                        onClick={() => { navigate("/Login"); toast.dismiss(); }}
                    >Fazer login</button>
                </div>
            )
            return;
        } else {
            navigate("/FormularioEquipe", { state: { modalidades, user } });
        }
    };

    const handleChange = (event) => {
        const value = event.target.value;
        setSelectedModalidade(value);

        if (value === "all") {
            setFilteredEquipes(equipes);
        } else {
            const filtered = equipes.filter(equipe =>
                equipe.idModalidade === value
            );
            setFilteredEquipes(filtered);
        }
    };

    useEffect(() => {
        const busca = async () => {
            try {
                const equipes = await buscar('equipe');
                const modalidades = await buscar('modalidade');
    
                // Ordena as modalidades antes de definir no estado
                const modalidadesOrdenadas = modalidades.sort((a, b) => a.Nome.localeCompare(b.Nome));
    
                setModalidades(modalidadesOrdenadas); // Atualiza o estado com modalidades ordenadas
                setEquipes(equipes);
    
                if (selectedModalidade === "all") {
                    setFilteredEquipes(equipes);
                } else {
                    const filtered = equipes.filter(equipe =>
                        equipe.idModalidade === selectedModalidade
                    );
                    setFilteredEquipes(filtered);
                }
            } catch (error) {
                toast.error(error);
            }
        };
    
        busca();
    }, [selectedModalidade]);  

    return (
        <div className="Equipes">
            <Header />
            <div className="opcao">
                <label>Lista de equipes na modalidade </label>
                <FormControl sx={{ m: 1, minWidth: 'calc(180px + 3vw)',height: 'calc(15px + 2vw)' }}>
                    <Select
                        value={selectedModalidade}
                        onChange={handleChange}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        sx={{
                            height: '100%', 
                            width: '100%',
                            fontSize: { xs: '16px', sm: '18px', md: '20px', lg: '22px' }, // Responsividade do texto
                        }}
                    >
                        <MenuItem value="all">
                            <em>Todos</em>
                        </MenuItem>
                        {modalidades.map(modalidade => (
                            <MenuItem key={modalidade.idModalidade} value={modalidade.idModalidade}>
                                {modalidade.Nome}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <button className="botaoEquipe" onClick={handleButtonClick}>Criar Equipe</button>
            </div>
            <div style={{ padding: '0 10%' }} className="listaEquipes">
                {filteredEquipes.map(equipe => (
                    equipe.isPublica ? (
                        <CardModalidae
                            key={equipe.idEquipe}
                            modalidade={modalidades.find(modalidade => equipe.idModalidade === modalidade.idModalidade)}
                            equipe={equipe}
                        />
                    ) : null
                ))}
            </div>
        </div>
    );
}
