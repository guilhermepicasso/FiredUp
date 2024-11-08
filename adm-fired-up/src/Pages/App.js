import '../App.css';

import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  const handleNavigation = (tela) => {
    navigate(`/${tela}`);
  };

  return (
    <div className="App">
      <p>Adicionar item</p>
      <button onClick={() => handleNavigation("Modalidade")}>Lista de modalidades</button>
      <button onClick={() => handleNavigation("Espaco")}>Lista de espaços</button>
      <button onClick={() => handleNavigation("Reservas")}>Reservas</button>
    </div>
  );
}

export default App;
