import "./index.scss";
import { useEffect, useState } from "react";
import CardModalidade from "./cardModalidade";
import CardItem from "./cardItem";
import { useLocation } from 'react-router-dom';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { buscar } from "../../API/chamadas";

function CriarEspaco() {
    const location = useLocation();
    const { espaco, itensEspaco, modalidadesEspaco, horariosEspacos } = location.state || {};
    const [itens, setItens] = useState([]);
    const [modalidades, setModalidades] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedModalidades, setSelectedModalidades] = useState([]);
    const [nomeEspaco, setNomeEspaco] = useState('');
    const [imagemEspaco, setImagemEspaco] = useState(null);
    const [regrasEspaco, setRegrasEspaco] = useState('');

    useEffect(() => {
        async function carregarItens() {
            try {
                const dadosItem = await buscar("Item");
                const dadosModalidaes = await buscar("Modalidade");
                if (espaco) {
                    setNomeEspaco(espaco.Nome)
                    setRegrasEspaco(espaco.Regras)
                    if (itensEspaco) {
                        // Filtra os itens e obtém somente os idItem que são em comum
                        const idItens = dadosItem
                            .filter(item =>
                                itensEspaco.some(espaco => espaco.idItem === item.idItem)
                            )
                            .map(item => item.idItem);  // Extrai somente os idItem dos itens filtrados

                        console.log("idItens é", idItens);
                        setSelectedItems(idItens);
                    }
                    if (modalidadesEspaco) {
                        // Filtra os itens e obtém somente os idItem que são em comum
                        const idModalidades = dadosModalidaes
                            .filter(modalidade =>
                                modalidadesEspaco.some(espaco => espaco.idModalidade === modalidade.idModalidade)
                            )
                            .map(modalidade => modalidade.idModalidade);  // Extrai somente os idItem dos itens filtrados

                        console.log("idModalidades é", idModalidades);
                        setSelectedModalidades(idModalidades);
                    }
                }
                setItens(dadosItem);
                setModalidades(dadosModalidaes);
            } catch (error) {
                console.error("Erro ao buscar itens:", error);
            }
        }
        carregarItens();

    }, []);

    const handleSelectItem = (id) => {
        setSelectedItems((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((itemId) => itemId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectModalidade = (id) => {
        setSelectedModalidades((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((modId) => modId !== id)
                : [...prevSelected, id]
        );
    };

    const handleImagemChange = (event) => {
        setImagemEspaco(event.target.files[0]);
    };

    const [alignment, setAlignment] = useState([]);
    const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]

    const handleChange = (event, newAlignment) => {
        if (alignment.includes(event.target.value)) {
            // Se o item já estiver selecionado, desmarque-o
            setAlignment(alignment.filter(item => item !== newAlignment));
            console.log(alignment);
            
        } else {
            // Caso contrário, adicione ao estado
            setAlignment([...alignment, newAlignment]);
        }
    };

    return (
        <div className="CriarEspaco">
            <h1>
                {espaco ? "Editar Espaço" : "Criar Espaço"}
            </h1>
            <div className="content">
                <section className="inputs">
                    <div>
                        <label htmlFor="nomeEspaco">Nome do Espaço</label>
                        <input className="InputTexto"
                            type="text"
                            id="nomeEspaco"
                            value={nomeEspaco}
                            onChange={(e) => setNomeEspaco(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="regrasEspaco">Regras do Espaço</label>
                        <textarea className="AreadeTexto"
                            id="regrasEspaco"
                            value={regrasEspaco}
                            onChange={(e) => setRegrasEspaco(e.target.value)}
                        />
                    </div>
                </section>
                <section>
                    <div className="cabecalho">
                        <h2>Lista de itens</h2>
                        <p>*Selecione os itens clicando neles</p>
                    </div>
                    <div className="list">
                        {itens.map((item) => (
                            <CardItem
                                key={item.idItem}
                                item={item}
                                isClickable={true} // Indica que os cards serão clicáveis
                                isSelected={selectedItems.includes(item.idItem)}//
                                onSelectItem={handleSelectItem} //
                            />
                        ))}
                    </div>
                </section>


                <section>
                    <div className="cabecalho">
                        <h2>Lista de modalidades</h2>
                        <p>*Selecione os itens clicando neles</p>
                    </div>
                    <div className="list">
                        {modalidades.map((modalidade) => (
                            <CardModalidade
                                key={modalidade.idModalidade}
                                modalidade={modalidade}
                                isClickable={true}
                                isSelected={selectedModalidades.includes(modalidade.idModalidade)}
                                onSelectModalidade={handleSelectModalidade}
                            />
                        ))}
                    </div>
                </section>

                <section>
                    <div className="cabecalho">
                        <h2>Horario de funcionamento</h2>
                        <p>*Selecione os itens clicando neles</p>
                    </div>
                    <div className="list">

                        <textarea
                            rows="5"
                            cols="30"
                            style={{
                                overflowY: 'auto', /* Habilita a rolagem vertical */
                                resize: 'vertical', /* Permite redimensionar o campo */
                            }}
                            value={horariosEspacos}
                            readOnly={true} // O textarea é somente leitura se isEditable for falso
                        />
                        <ToggleButtonGroup
                            // color="primary"
                            value={alignment}
                            exclusive
                            onChange={handleChange}
                            aria-label="Platform"
                        >
                            {days.map((day) => (
                                <ToggleButton
                                    value={day}
                                    sx={{
                                        backgroundColor: alignment.includes(day) ? "red" : "", // Laranja se selecionado
                                        color: alignment.includes(day) ? "white" : "", // Texto branco se selecionado
                                        '&:hover': {
                                            backgroundColor: alignment.includes(day) ? "red" : "", // Laranja ao passar o mouse se selecionado
                                        }
                                    }}
                                >{day}</ToggleButton>

                            ))}
                        </ToggleButtonGroup>
                    </div>
                </section>


            </div>
        </div>
    );
}

export default CriarEspaco;
