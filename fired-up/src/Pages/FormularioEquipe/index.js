import "./index.scss"
import React, { useState } from 'react';
import { toast } from 'react-toastify';


export default function FormularioEquipe() {
  const [nomeEquipe, setNomeEquipe] = useState('');
  const [local, setLocal] = useState('Quadra');
  const [data, setData] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [modalidade, setModalidade] = useState('Selecionar');
  const [privacidade, setPrivacidade] = useState('Público');

  const handlePrivacidade = (tipo) => {
    setPrivacidade(tipo); 
  };

  const handleVerificar = () => {
    if (!nomeEquipe || !data || !horaInicio || !horaFim || modalidade === 'Selecionar') {
      toast.info("Por favor, preencha todos os campos");
    } else {
      toast("Registro para confirmação");
    }
  }

  return (
    <div className="nova-equipe-container">
      <div className="nova-equipe">
        <button className="close-button">✖</button>
        <h2>Nova Equipe</h2>

        <label>Nome da Equipe</label>
        <input
          type="text"
          placeholder="Nome do time"
          value={nomeEquipe}
          onChange={(e) => setNomeEquipe(e.target.value)}
        />

        <label>Local</label>
        <select value={local} onChange={(e) => setLocal(e.target.value)}>
          <option>Quadra</option>
        </select>

        <label>Data do Evento</label>
        <div className="data-evento">
          <div className="input-icon">
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </div>
          <div className="input-icon">
            <input
              type="time"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              placeholder="Horário início"
            />
          </div>
          <div className="input-icon">
            <input
              type="time"
              value={horaFim}
              onChange={(e) => setHoraFim(e.target.value)}
              placeholder="Horário Fim"
            />
          </div>
        </div>

        <label>Modalidade</label>
        <select value={modalidade} onChange={(e) => setModalidade(e.target.value)}>
          <option>Selecionar</option>
        </select>

        <label>Privacidade</label>
        <div className="privacidade">
          <button
            className={`public ${privacidade === "Público" ? "active" : ""}`}
            onClick={() => handlePrivacidade("Público")}
          >Público
          </button>
          <button
            className={`private ${privacidade === "Privado" ? "active" : ""}`}
            onClick={() => handlePrivacidade("Privado")}
          >Privado
          </button>
        </div>

        <button className="register-button" onClick={handleVerificar}>Registro</button>
      </div>
    </div>
  );
}

