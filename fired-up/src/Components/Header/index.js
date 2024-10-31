import { useNavigate } from 'react-router-dom';
import './index.scss';

function Header() {
  
  const nomeUsuario = '';
  const navigate = useNavigate();

  const voltarHome = () => {navigate("/")};
  return (
    <header>
     <img src="Logo.png" alt="Logo marca da FiredUp" onClick={voltarHome}/>
        <div className="sessoes">
          <a href="#times">times</a>
          <a href="#meuTime">meu time</a>
          <a href="#sobre">sobre</a>
        </div>
        <div className="login">
          {nomeUsuario === "" ?
            <div className="nomeUsuario">Login</div> :
            <div>{nomeUsuario}</div>
          }
        </div>
    </header>
  );
}

export default Header;
