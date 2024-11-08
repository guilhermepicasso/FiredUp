import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useState } from 'react';
import { criar } from '../API/chamadas';

export default function ModalidadeEspaco(params) {
    const [selectedModalidades, setSelectedModalidades] = useState([]);

    const handleChangeModalidades = (event) => {
        const { value, checked } = event.target;

        setSelectedModalidades((prevSelected) => {
            if (checked) {
                // Se estiver marcado, adiciona o ID da modalidade ao array
                return [...prevSelected, value];
            } else {
                // Se desmarcado, remove o ID da modalidade do array
                return prevSelected.filter(idModalidade => idModalidade !== value);
            }
        });
    };

    const inserirModalidades = () => {
        try {
            if (selectedModalidades.length > 0) {
                selectedModalidades.forEach(async modalidade => {
                    const body = {
                        "idModalidade": modalidade,
                        "idEspaco": params.idEspaco
                    }
                    const resp3 = await criar({ tabela: "ModalidadeEspaco", body: body });
                });
            } else {
                // toast.error("Selecione ao menos 1 modalidade!");
            }
        } catch (error) {
            // toast.error("Erro ao inserir modalidades!");
            console.log(error);
        }

    }

    return (
        <div>
            {params.modalidades.map(modalidade => (
                <FormControlLabel control={
                    <Checkbox
                        value={modalidade.idModalidade}
                        onChange={handleChangeModalidades}
                    />}
                    label={modalidade.Nome}
                />
            ))}
        </div>
    )
}