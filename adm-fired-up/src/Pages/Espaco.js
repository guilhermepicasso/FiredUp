import '../App.css';



import { useEffect, useState } from 'react';
import { alterarFotoEspaco, buscar, buscarId, criar, deletar } from '../API/chamadas';
import { useNavigate } from 'react-router-dom';


export default function Espaco() {
    const [modalidadesCadastradas, setModalidadesCadastradas] = useState([]);

    const [itensCadastrados, setItensCadastrados] = useState([]);
    const [espaco, setEspaco] = useState({ nome: "", regras: "", foto: null });


    const [infoEspacos, setInfoEspacos] = useState([])

    const navigate = useNavigate();
    const handleNavigation = (tela) => {
        navigate(`/${tela}`);
    };

    const handleInputChange = (event) => {
        const { name, value, files, type } = event.target;

        if (type === "file" && files) {
            setEspaco(prevState => ({
                ...prevState,
                foto: files[0],
            }));
        } else {
            setEspaco(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const body = {
                "nome": espaco.nome,
                "regras": espaco.regras
            }
            const resp = await criar({ tabela: "espaco", body: body });

            if (resp.status === 200) {
                await fetchEspacos();
                // if (espaco.foto != null) {
                //     //salva a imagem
                //     const resp2 = await alterarFotoEspaco(resp.data.id, espaco.foto)
                // }
            }

            setEspaco({ nome: "", regras: "", foto: null });
            // toast.success("Novo espaço cadastrado com sucesso!");
        } catch (error) {
            // toast.error("Erro ao cadastrar novo espaço!");
            console.log(error);
        }
    };

    const excluir = async (id) => {
        try {
            const resp = await deletar({ tabela: "espaco", id: id });
            if (resp.status === 200){
                await fetchEspacos();
            }
            console.log(resp);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchEspacos = async () => {
        try {
            const espacos = await buscar("espaco");
            const infoEspacos = [];
            for (const espaco of espacos) {
                const espacoInfo = {
                    espaco: espaco,
                    disponibilidade: [],
                    modalidades: [],
                    itens: []
                };

                try {
                    const disponibilidadeEspaco = await buscarId({ tabela: "disponibilidadeEspaco", busca: "idEspaco", id: espaco.idEspaco });
                    espacoInfo.disponibilidade = disponibilidadeEspaco.data;
                } catch (error) {
                    if (error.response && error.response.status !== 404) {
                        console.error(`Erro ao buscar disponibilidades para o espaço com ID ${espaco.idEspaco}:`, error);
                    }
                }

                try {
                    const modalidadeEspaco = await buscarId({ tabela: "modalidadeEspaco", busca: "idEspaco", id: espaco.idEspaco });
                    espacoInfo.modalidades = modalidadeEspaco.data;
                } catch (error) {
                    if (error.response && error.response.status !== 404) {
                        console.error(`Erro ao buscar modalidades para o espaço com ID ${espaco.idEspaco}:`, error);
                    }
                }

                try {
                    const itensEspaco = await buscarId({ tabela: "ItemEspaco", busca: "idEspaco", id: espaco.idEspaco });
                    espacoInfo.itens = itensEspaco.data;
                } catch (error) {
                    if (error.response && error.response.status !== 404) {
                        console.error(`Erro ao buscar itens para o espaço com ID ${espaco.idEspaco}:`, error);
                    }
                }

                infoEspacos.push(espacoInfo);
            }
            setInfoEspacos(infoEspacos);
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        const busca = async () => {
            try {
                const modalidades = await buscar("modalidade");
                const itens = await buscar("item");
                await fetchEspacos();
                setModalidadesCadastradas(modalidades);
                setItensCadastrados(itens);
            } catch (error) {
                console.log(error);
            }
        }
        busca();
    }, [])

    return (
        <div className='cadastro_espaco'>
            <p>Cadastre um novo espaço</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="nome"
                    placeholder="Digite o nome do espaço"
                    value={espaco.nome}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="regras"
                    placeholder="Digite as regras do espaço"
                    value={espaco.regras}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="file"
                    name="foto"
                    accept="image/*"
                    onChange={handleInputChange}
                />
                <button type="submit">CADASTRAR ESPAÇO</button>
            </form>


            <div className='lista_espacos'>
                <p>Lista de espaços já cadastrados</p>
                {infoEspacos.map((info, key) => (
                    <div key={key} className='espaco'>
                        <section className='info_espaco'>
                            <div className='imgEspaco'>
                                <img src={info.espaco.Foto} alt={`Foto do espaço ${info.espaco.Nome}`} />
                            </div>
                            <p>Espaço: {info.espaco.Nome}</p>
                            <p>Regras: {info.espaco.Regras}</p>
                        </section>
                        <section className='disponibilidade_espaco'>
                            <p>Horario de funcionamento</p>
                            {info.disponibilidade.length > 0 ? (
                                <div>
                                    {info.disponibilidade.map((disponibilidade, key) => (
                                        <p key={key}>
                                            {disponibilidade.DiaSemana} das {disponibilidade.HoraInicio} às {disponibilidade.HoraFim}
                                        </p>
                                    ))}
                                    <button>Alterar disponibilidade</button>
                                </div>
                            ) : (
                                <div>
                                    <p>Não há nenhuma disponibilidade cadastrada</p>
                                    <button onClick={() => handleNavigation("Disponibilidade")}>Inserir disponibilidade</button>
                                </div>
                            )}
                        </section>

                        <section className='modalidade_espaco'>
                            <div>Modalidades que podem ser praticadas neste espaço</div>
                            {info.modalidades.length > 0 ? (
                                <div>
                                    {info.modalidades.map((modalidade, key) => (
                                        <p key={key}>
                                            {modalidadesCadastradas.filter(m => m.idModalidade === modalidade.idModalidade)[0]?.Nome}
                                        </p>
                                    ))}
                                    <button>Editar Modalidades</button>
                                </div>
                            ) : (
                                <div>
                                    <p>Não há nenhuma modalidade cadastrada</p>
                                    <button>Inserir modalidade</button>
                                </div>
                            )}
                        </section>

                        <section className='itens_espaco'>
                            <div>Itens que podem ser retirados neste espaço</div>
                            {info.itens.length > 0 ? (
                                <div>
                                    {info.itens.map((item, key) => (
                                        <div>
                                            <p key={key}>
                                                {itensCadastrados.filter(m => m.idItem === item.idItem)[0]?.Nome}
                                            </p>
                                            <p key={key}>
                                                Quantidade total: {itensCadastrados.filter(m => m.idItem === item.idItem)[0]?.QtdTotal}
                                            </p>
                                            <p key={key}>
                                                Quantidade disponivel: {itensCadastrados.filter(m => m.idItem === item.idItem)[0]?.QtdDisponivel}
                                            </p>
                                        </div>
                                    ))}
                                    <button>Editar Itens</button>
                                </div>
                            ) : (
                                <div>
                                    <p>Não há nenhum item cadastrada</p>
                                    <button>Inserir item</button>
                                </div>
                            )}
                        </section>

                        <button onClick={() => excluir(info.espaco.idEspaco)}>Excluir espaço</button>
                    </div>
                ))}
            </div>
        </div>
    )
}