import "./index.scss";
import { useAuth } from "../../Components/UserContext/AuthContext.js"
import Header from "../../Components/Header/index.js"
import { useEffect, useState } from "react"
import { buscar } from "../../API/chamadas.js"
import ListaEquipes from "./Componente/listaEquipes.js"

export default function UserPage() {
    const { user } = useAuth()
    const [minhasEquipes, setMinhasEquipes] = useState([])
    const [equipesParticipo, setEquipesParticipo] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const minhas_equipes = await buscar(`equipe/idResponsavel/${user.RA}`);
                setMinhasEquipes(minhas_equipes);
            } catch (error) {
                if (error.status !== 404) {
                    console.error('Erro ao buscar minhas equipes:', error);
                }
            }

            try {
                const equipes_que_participo = await buscar(`participante/idUsuario/${user.RA}`);
                const infoEquipes = await Promise.all(
                    equipes_que_participo.map(async (id) => {
                        try {
                            const equipe = await buscar(`equipe/idEquipe/${id.idEquipe}`);
                            return equipe[0];
                        } catch (error) {
                            console.error("Erro ao buscar equipe:", error);
                            return null;
                        }
                    })
                );

                setEquipesParticipo(infoEquipes.filter(equipe => equipe !== null));
            } catch (error) {
                console.error('Erro ao buscar equipes que participo:', error);
            }
        };
        fetchData()
    }, [user.RA])

    return (
        <div>
            <Header />
            <div className="Lista">
                <h1>Minhas Equipes</h1>
                <ListaEquipes array={minhasEquipes} my={true} ></ListaEquipes>
            </div>
            <div className="Lista">
                <h1>Equipes que Participo</h1>
                <ListaEquipes array={equipesParticipo} ></ListaEquipes>
            </div>
        </div>
    )
}