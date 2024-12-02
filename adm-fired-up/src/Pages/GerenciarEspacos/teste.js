import "./index.scss"
import Button from '@mui/material/Button';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import Card from "./card";

export default function CardItem2(params) {
    const handleChange = () => {

    }

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
                    <Card tipo={params.tipo} itens={params.itens} item={item} change={params.change} fetchEspacosData={params.fetchEspacosData} />
                ))}
            </div>
        </section>
    )
}