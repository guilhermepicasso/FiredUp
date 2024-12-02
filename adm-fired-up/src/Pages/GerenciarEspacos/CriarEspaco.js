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

    return (
        <div className="CriarEspaco">
            <div className="content">
                <section>
                    <div className="cabecalho">
                        <h2>Lista de itens</h2>
                    </div>
                    <div className="list">
                        {itens.map((item) => (
                            <CardItem
                                key={item.idItem}
                                item={item}
                                isClickable={true} // Indica que os cards serão clicáveis
                                onSelectItem={handleSelectItem} // Passa a função para capturar o ID
                                isSelected={selectedItems.includes(item.idItem)}
                            />
                        ))}
                    </div>
                </section>
                    <h3>Itens Selecionados</h3>
                    <p>{selectedItems || "Nenhum item selecionado"}</p>

                <section>
                    <div className="cabecalho">
                        <h2>Lista de modalidades</h2>
                    </div>
                    <div className="list">
                        {modalidades.map((modalidade) => (
                            <CardModalidade
                                key={modalidade.idModalidade}
                                modalidade={modalidade} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default CriarEspaco;
