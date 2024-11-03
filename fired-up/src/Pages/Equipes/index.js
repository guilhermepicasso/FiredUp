import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { buscarEquipes, buscarModalidades, buscarParticipantes } from '../../API/chamadas';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CardModalidae from '../../Components/CardModalidade';


export default function Equipes() {
    const [times, setTimes] = useState([]);
    const location = useLocation();
    const { id, img, modalidade } = location.state || {};
    const [selectedModalidade, setSelectedModalidade] = useState({
        id: id,
        img: img,
        modalidade: modalidade
    });
    const [modalidades, setModalidades] = useState([]);


    const handleChange = (event) => {
        // Filtra para encontrar a modalidade correspondente
        const modalidade = modalidades.find(mod => mod.idModalidade === Number(event.target.value));

        if (modalidade) {
            // Atualiza todo o objeto `selectedModalidade` de uma vez
            setSelectedModalidade({
                id: modalidade.idModalidade,
                modalidade: modalidade.Nome,
                img: modalidade.Foto
            });
        }
    };

    let filteredTimes = times;

    if (selectedModalidade.modalidade !== 'all') {
        filteredTimes = times.filter(time =>
            time.idModalidade === selectedModalidade.id
        );
    }

    useEffect(() => {
        const buscarTimes = async () => {
            try {
                const times = await buscarEquipes();
                const modalidades = await buscarModalidades();

                setModalidades(modalidades);
                setTimes(times);
                console.log(times);

            } catch (error) {
                console.log(error);
            }
        }
        buscarTimes();
    }, [])

    return (

        <div className="opcao">
            <label>Lista de times na modalidade </label>
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

            <div style={{ backgroundColor: 'transparent'}} className='modalidades'>
                <div className="listaModalidades">
                    {filteredTimes.map(time => (
                        <CardModalidae id={time.idEquipe} img={selectedModalidade.img} modalidade={selectedModalidade.modalidade} equipe={time}></CardModalidae>
                    ))}
                </div>
            </div>
        </div>
    )
}