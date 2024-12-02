import CardEquipe from "./cardEquipe";

export default function ListaEquipes(params) {
    return (
        <div className="lista_equipes">
            {params.array && params.array.length > 0 ? (
                params.array.map(equipe => (
                    <CardEquipe equipe={equipe} my={params.my} onDataChanged={params.onDataChanged} />
                ))
            ) : (
                <div>Não tem nenhuma equipe aqui!</div>
            )}
        </div>
    );
}