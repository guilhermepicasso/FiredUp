import "./index.scss";
import { useAuth } from "../../Components/UserContext/AuthContext.js"
import Header from "../../Components/Header/index.js"
import { useEffect, useState } from "react"
import { buscar } from "../../API/chamadas.js"
import ListaEquipes from "./Componente/listaEquipes.js"
import Footer from "../../Components/Footer/index.js";

export default function UserPage() {
    const { user } = useAuth()
    const [minhasEquipes, setMinhasEquipes] = useState([])
    const [equipesParticipo, setEquipesParticipo] = useState([])

    const fetchMinhasEquipes = async () => {
        try {
            const minhas_equipes = await buscar(`equipe/idResponsavel/${user.RA}`);
            setMinhasEquipes(minhas_equipes.filter(equipe => equipe !== null));
            console.log("ok na fetchMinhasEquipes");
            
        } catch (error) {
            if (error.status !== 404) {
                console.error('Erro ao buscar minhas equipes:', error);
            } else {
                setMinhasEquipes([]);
            }
        }
    };

    const fetchEquipesQueParticipo = async () => {
        try {
            const equipes_que_participo = await buscar(`participante/idUsuario/${user.RA}`);
            const infoEquipes = await Promise.all(
                equipes_que_participo.map(async (participante) => {
                    try {
                        const equipe = await buscar(`equipe/idEquipe/${participante.idEquipe}`);
                        if (equipe[0]) {
                            return { ...equipe[0], idParticipante: participante.idParticipante };
                        }
                        return null;
                    } catch (error) {
                        console.error("Erro ao buscar equipe:", error);
                        return null;
                    }
                })
            );
            setEquipesParticipo(infoEquipes.filter(equipe => equipe !== null));
            console.log("ok na fetchEquipesQueParticipo");
        } catch (error) {
            if (error.status !== 404) {
                console.error('Erro ao buscar equipes que participo:', error);
            } else {
                setEquipesParticipo([]);
            }
        }
    };

    useEffect(() => {
        if (user.RA) {  // Verifique se `user.RA` está disponível antes de fazer as requisições
            fetchEquipesQueParticipo();
            fetchMinhasEquipes();
        }
    }, [user.RA]);


    return (
        <div>
            <Header />
            <div className="Lista">
                <h1>Minhas Equipes</h1>
                <ListaEquipes array={minhasEquipes} my={true} onDataChanged={fetchMinhasEquipes} />
            </div>
            <div className="Lista">
                <h1>Equipes que Participo</h1>
                <ListaEquipes array={equipesParticipo} onDataChanged={fetchEquipesQueParticipo} />
            </div>
            <Footer />
        </div>
    )
}