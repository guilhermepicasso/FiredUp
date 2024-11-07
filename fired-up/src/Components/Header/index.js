import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../Components/UserContext/AuthContext.js";
import './index.scss';

function Header() {
  const nomeUsuario = '';
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

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
        {isAuthenticated ? (
          <div className='nomeUsuario'>{user.nome}</div>
        ) : (
          <div onClick={() => navigate('/Login')} className="botaoLogin">Login</div>
        )}
      </div>
    </header>
  );
}

export default Header;
