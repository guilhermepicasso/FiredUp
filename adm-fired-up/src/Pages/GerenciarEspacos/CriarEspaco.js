import "./index.scss";
import { useEffect, useState } from "react";
import CardModalidade from "./cardModalidade";
import CardItem from "./cardItem";
import { useLocation, useNavigate, useNavigation } from 'react-router-dom';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import dayjs from 'dayjs';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';

import { alterar, buscar, criar, deletar } from "../../API/chamadas";
import { toast } from "react-toastify";

function CriarEspaco() {
    const location = useLocation();
    const navigate = useNavigate();
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
    const [horariosAdd, setHorariosAdd] = useState(horariosEspaco ? horariosEspaco : []);
    const [horaInicio, setHoraInicio] = useState(null);
    const [horaFim, setHoraFim] = useState(null);

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

    const salvarNovoEspaco = async () => {
        if (nomeEspaco === "" || regrasEspaco === "") {
            toast.warn("Todos os campos de texto precisam ser preenchidos! Verifique se o nome do espaço e as regras foram preenchidos!");
            return;
        }
        try {
            const bodyEspaco = {
                "Nome": nomeEspaco,
                "Regras": regrasEspaco
            };
            console.log("salvar espaco vai salvar ", bodyEspaco);
            const result = await criar({ tabela: "Espaco", body: bodyEspaco });
            console.log(result);

            if (result.status === 200) {
                const espacoId = result.data.id;

                if (horariosAdd.length > 0) {
                    for (const item of horariosAdd) {
                        item.idEspaco = espacoId;
                        console.log("item pra salvar é ", item);

                        const retorno = await criar({ tabela: "HorarioFuncionamento", body: item });
                        console.log("Horarios de funcionamento salvos", retorno);
                    }
                }

                if (selectedModalidades.length > 0) {
                    for (const item of selectedModalidades) {
                        const bodyModalidade = {
                            "idModalidade": item,
                            "idEspaco": espacoId
                        };
                        console.log("tentando salvar modalidade ", bodyModalidade);

                        const retorno = await criar({ tabela: "ModalidadeEspaco", body: bodyModalidade });
                        console.log("modalidade salva ", retorno);
                    }
                }

                if (selectedItems.length > 0) {
                    for (const item of selectedItems) {
                        const bodyIten = {
                            "idItem": item,
                            "idEspaco": espacoId
                        };
                        console.log("tentando salvar item", bodyIten);

                        const retorno = await criar({ tabela: "ItemEspaco", body: bodyIten });
                        console.log("itens salvos ", retorno);
                    }
                }
            }

            toast.success("Espaço adicionado com sucesso!");
            navigate(-1);
        } catch (error) {
            console.error("Erro ao salvar novo espaço!", error);
            toast.error("Erro ao salvar novo espaço!");
        }
    };



    const editarEspaco = async () => {

        try {
            const bodyEspaco = {}
            if (espaco.Nome !== nomeEspaco) {
                bodyEspaco.Nome = nomeEspaco;
            }
            if (espaco.Regras !== regrasEspaco) {
                bodyEspaco.Regras = regrasEspaco
            }
            if (Object.keys(bodyEspaco).length > 0) {
                await alterar({ tabela: "Espaco", id: espaco.idEspaco, body: bodyEspaco })
            }

            selectedItems.forEach(async item => {
                // Verifique se o idItem de itensEspaco não está em selectedItems
                const exists = itensEspaco.some(espaco => espaco.idItem === item);

                if (!exists) {
                    const bodyIten = {
                        "idItem": item,
                        "idEspaco": espaco.idEspaco
                    }
                    const retorno = await criar({ tabela: "itemEspaco", body: bodyIten })
                    console.log("retorno é  ", retorno);
                }
            });

            itensEspaco.forEach(async item => {
                if (!selectedItems.includes(item.idItem)) {
                    await deletar({ tabela: "ItemEspaco", id: item.idItemEspaco })
                }
            });

            selectedModalidades.forEach(async item => {
                // Verifique se o idItem de itensEspaco não está em selectedItems
                const exists = modalidadesEspaco.some(espaco => espaco.idModalidade === item);

                if (!exists) {
                    const body = {
                        "idModalidade": item,
                        "idEspaco": espaco.idEspaco
                    }
                    console.log("body de modalidadeespaco", body);

                    const retorno = await criar({ tabela: "modalidadeEspaco", body: body })
                    console.log("retorno é  ", retorno);
                }
            });

            modalidadesEspaco.forEach(async item => {
                if (!selectedModalidades.includes(item.idModalidade)) {
                    await deletar({ tabela: "ModalidadeEspaco", id: item.idModalidadeEspaco })
                }
            });

            const horariosexcluidos = horariosEspaco.filter(itemAdd =>
                !horariosAdd.some(itemEspaco => itemEspaco.idHorarioFuncionamento === itemAdd.idHorarioFuncionamento)
            );

            if (horariosexcluidos.length > 0) {
                horariosexcluidos.forEach(async horario => {
                    await deletar({ tabela: "HorarioFuncionamento", id: horario.idHorarioFuncionamento })
                });
            }

            const horariosNaoExistentes = horariosAdd.filter(itemAdd =>
                !horariosEspaco.some(itemEspaco => itemEspaco.idHorarioFuncionamento === itemAdd.idHorarioFuncionamento)
            );
            
            if (horariosNaoExistentes.length > 0) {
                horariosNaoExistentes.forEach(async horario => {
                    horario.idEspaco = espaco.idEspaco;
                    await criar({ tabela: "HorarioFuncionamento", body: horario })
                });
            }
            toast.success("Salvou alterações com sucesso!");
            navigate(-1)
        } catch (error) {
            toast.warn("Erro ao alterar espaço!")
        }

    }


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
                    <div className="horarios">
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
                                            onChange={(newValue) => setHoraInicio(newValue)}
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
                                            // {horaInicio ? dayjs(horaInicio).format('hh:mm A') : "Hora Fim"}
                                            label="Hora Fim"
                                            onChange={(newValue) => setHoraFim(newValue)}
                                            minTime={horaInicio}
                                            viewRenderers={{
                                                hours: renderTimeViewClock,
                                                minutes: renderTimeViewClock,
                                                seconds: renderTimeViewClock,
                                            }}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </div>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    if (selectedDays.length === 0) {
                                        toast.warn("Selecione ao menos um dia da semana!");
                                    } else if (horaInicio === null) {
                                        toast.warn("Selecione uma hora de inicio de funcionamento do espaço!");
                                    } else if (horaFim === null) {
                                        toast.warn("Selecione uma hora de encerramento do funcionamento do espaço!");
                                    } else if (dayjs(horaFim).isBefore(dayjs(horaInicio))) {
                                        // Verifica se horaFim é menor que horaInicio
                                        toast.warn("A hora de fim deve ser maior que a hora de início!");
                                    } else {
                                        selectedDays.forEach(day => {
                                            const body = {
                                                diaSemana: day,
                                                horaInicio: dayjs(horaInicio).format('HH:mm:ss'),
                                                horaFim: dayjs(horaFim).format('HH:mm:ss')
                                            }
                                            setHorariosAdd(prevHorarios => [...prevHorarios, body]);
                                        });
                                    }
                                }}
                                sx={{
                                    backgroundColor: "red"
                                }}
                            >
                                Add novo horário
                            </Button>
                        </div>

                        <div className="horariosList" >
                            {horariosAdd && horariosAdd.map((horario) =>
                                <div className="horarioItem">
                                    <p>{`${horario.diaSemana} das ${horario.horaInicio} as ${horario.horaFim}`}</p>
                                    <IconButton
                                        aria-label="delete"
                                        size="small"
                                        onClick={() => {
                                            const index = horariosAdd.findIndex(item => item.idHorarioFuncionamento === horario.idHorarioFuncionamento);

                                            if (index !== -1) {
                                                setHorariosAdd(prevHorarios => {
                                                    const novosHorarios = [...prevHorarios];
                                                    novosHorarios.splice(index, 1);
                                                    return novosHorarios;
                                                });
                                            }
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </div>
                            )}
                        </div>

                    </div>
                </section>

                <Button
                    variant="contained"
                    onClick={() => espaco ? editarEspaco() :
                        salvarNovoEspaco()
                    }
                    sx={{
                        backgroundColor: "red"
                    }}
                >
                    { espaco ? "Salvar alterações": "Add novo Espaço"}
                </Button>


            </div>
        </div>
    );
}

export default CriarEspaco;
