import "./index.scss";
import { useEffect, useState } from "react";
import CardModalidade from "./cardModalidade";
import CardItem from "./cardItem";
import { useLocation } from 'react-router-dom';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

import { buscar } from "../../API/chamadas";

function CriarEspaco() {
    const location = useLocation();
    const { espaco, itensEspaco, modalidadesEspaco, horariosEspaco } = location.state || {};
    const [itens, setItens] = useState([]);
    const [modalidades, setModalidades] = useState([]);
    const [nomeEspaco, setNomeEspaco] = useState('');
    const [regrasEspaco, setRegrasEspaco] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedModalidades, setSelectedModalidades] = useState([]);
    const [selectedDays, setSelectedDays] = useState([]);
    const days = {
        "Segunda": "Seg",
        "Terça": "Ter",
        "Quarta": "Qua",
        "Quinta": "Qui",
        "Sexta": "Sex",
        "Sábado": "Sáb",
        "Domingo": "Dom",
    }
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFim, setHoraFim] = useState("");
    const [textarea, setTextarea] = useState("");

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
                    console.log("Horarios é", horariosEspaco);
                    if (horariosEspaco) {
                        let text = "";
                        let x = []
                        Object.entries(horariosEspaco).forEach(([dia, horarios]) => {
                            text += `${dia} `;
                            console.log(horarios);

                            if (horarios.length > 0) {
                                const horariosUnicos = [...new Set(horarios)]; // Remove duplicatas dentro do array de horários
                                if (horariosUnicos.length > 0) {
                                    text += `${dia} ${horariosUnicos.join(" e ")}\n`;
                                }
                            }
                            x.push(text);
                            text = ""
                        });

                        console.log(x);
                        setTextarea(x)
                    }
                    // const dias = []
                    // const hora_inicio = []
                    // const hora_fim = []
                    // horariosEspaco.forEach(horario => {
                    //     dias.push(horario.diaSemana);
                    //     hora_inicio.push(horario.HoraInicio);
                    // });



                    // setSelectedDays(dias);

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

    const handleChange = (event) => {
        if (selectedDays.includes(event.target.value)) {
            // Remover o item selecionado
            const updatedAlignment = selectedDays.filter(item => item !== event.target.value);
            setSelectedDays(updatedAlignment);
            console.log("Desmarcou o item:", event.target.value);
            console.log("Lista agora contém:", updatedAlignment);
        } else {
            // Adicionar o item selecionado
            const updatedAlignment = [...selectedDays, event.target.value];
            setSelectedDays(updatedAlignment);
            console.log("Marcou o item:", event.target.value);
            console.log("Lista agora contém:", updatedAlignment);
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
                        <div>
                            {textarea && textarea.map((text) => (
                                <p>{text}</p>
                            ))}
                        </div>
                        <div>

                            <ToggleButtonGroup
                                value={selectedDays}
                                onChange={handleChange}
                                aria-label="Platform"
                            >
                                {Object.entries(days).map(([key, value]) => (
                                    <ToggleButton
                                        key={key}
                                        value={key}
                                        sx={{
                                            backgroundColor: selectedDays.includes(key) && "#f78b1f !important",
                                            color: selectedDays.includes(key) ? "white" : "black",
                                            '&:hover': {
                                                backgroundColor: !selectedDays.includes(key) && "#f78b1f !important",
                                            },
                                        }}
                                    >
                                        {value}
                                    </ToggleButton>
                                ))}
                            </ToggleButtonGroup>
                            <div >
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['TimePicker']}>
                                        <TimePicker
                                            label="Hora Inicio"
                                            viewRenderers={{
                                                hours: renderTimeViewClock,
                                                minutes: renderTimeViewClock,
                                                seconds: renderTimeViewClock,
                                            }}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['TimePicker']}>
                                        <TimePicker
                                            label="Hora Fim"
                                            viewRenderers={{
                                                hours: renderTimeViewClock,
                                                minutes: renderTimeViewClock,
                                                seconds: renderTimeViewClock,
                                            }}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </div>
                        </div>

                    </div>
                </section>


            </div>
        </div>
    );
}

export default CriarEspaco;
