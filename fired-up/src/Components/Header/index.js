import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../../Components/UserContext/AuthContext.js";
import './index.scss';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

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
      {location.pathname === '/' && (
        <div className="sessoes">
          <a href="#modalidades" onClick={(e) => { e.preventDefault(); scrollToSection('modalidades'); }}>Modalidades</a>
          <a href="#sobre" onClick={(e) => { e.preventDefault(); scrollToSection('sobre'); }}>sobre</a>
        </div>
      )}
      <div className="login">
        {isAuthenticated ? (
          location.pathname === '/UserPage' ? (
            <div onClick={() => logout()} className="botaoLogin">Logout</div>
          ) : (
            <div onClick={() => navigate('/UserPage')} className="botaoLogin">{user.nome}</div>
          )
        ) : (
          <div onClick={() => navigate('/Login')} className="botaoLogin">Login</div>
        )}
      </div>
    </header>
  );
}

export default Header;
