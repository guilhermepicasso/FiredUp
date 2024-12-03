import "./index.scss";
import { useEffect, useState } from "react";
import CardModalidade from "./cardModalidade";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CardItem from "./cardItem";

import { buscar } from "../../API/chamadas";

function CriarEspaco() {
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

    return (
        <div className="CriarEspaco">
            <h1>Criar Espaços</h1>
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
                        <label htmlFor="imagemEspaco">Imagem do Espaço</label>
                        <input className="InputImage"
                            type="file"
                            id="imagemEspaco"
                            onChange={handleImagemChange}
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
                                onSelectItem={handleSelectItem} //
                                isSelected={selectedItems.includes(item.idItem)}//
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
                                onSelectModalidade={handleSelectModalidade} />
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}

export default CriarEspaco;
