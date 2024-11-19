import { useNavigate, useLocation } from 'react-router-dom';
import './index.scss';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const hideSection = ['/GerenciarReservas', '/GerenciarEspacos'];

  const voltarHome = () => {
    navigate("/HomeViewADM");
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header>
      <img src="/Assets/images/logoFired.png" alt="Logo marca da FiredUp" onClick={voltarHome} />
      {!hideSection.includes(location.pathname) && (
        <div className="sessoes">
          <a href="#reservas" onClick={(e) => { e.preventDefault(); scrollToSection('reservas'); }}>Reservas</a>
          <a href="#gerenciarEspaco" onClick={(e) => { e.preventDefault(); scrollToSection('espacos'); }}>Espaços</a>
        </div>
      )}
      <div>
        <div className='nomeUsuario'>Centro Esportivo</div>
      </div>
    </header>
  );
}

export default Header;