import { useNavigate } from 'react-router-dom';
import './index.scss';

function Header() {
  const nomeUsuario = '';
  const navigate = useNavigate();

  const voltarHome = () => {
    navigate("/");
  };

  // Função para rolar até o id desejado
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header>
      <img src="Logo.png" alt="Logo marca da FiredUp" onClick={voltarHome} />
      <div className="sessoes">
        <a href="#modalidades" onClick={(e) => { e.preventDefault(); scrollToSection('modalidades'); }}>Modalidades</a>
        <a href="#meuTime" onClick={(e) => { e.preventDefault(); scrollToSection('meuTime'); }}>meu time</a>
        <a href="#sobre" onClick={(e) => { e.preventDefault(); scrollToSection('sobre'); }}>sobre</a>
      </div>
      <div className="login">
        {nomeUsuario === "" ? (
          <div className="nomeUsuario">Login</div>
        ) : (
          <div>{nomeUsuario}</div>
        )}
      </div>
    </header>
  );
}

export default Header;
