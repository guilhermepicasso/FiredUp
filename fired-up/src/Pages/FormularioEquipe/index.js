import "./index.scss"
import React, { useState, useEffect } from 'react';
import { buscarModalidades, criarEquipe } from '../../API/chamadas.js';
import { toast } from 'react-toastify'; 
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from 'axios';



export default function FormularioEquipe() {
  const [nomeEquipe, setNomeEquipe] = useState('');
  //const [local, setLocal] = useState('Quadra');
  const [numeroMaximo, setNumeroMaximo] = useState('');
  //const [data, setData] = useState('');
  //const [horaInicio, setHoraInicio] = useState('');
  //const [horaFim, setHoraFim] = useState('');
  const [modalidade, setModalidade] = useState('Selecionar');
  const [privacidade, setPrivacidade] = useState('Público');
  const [modalidades, setModalidades] = useState([]);

  useEffect(() => {
    const carregarModalidades = async () => {
      try {
        const data = await buscarModalidades();
        setModalidades(data);
      } catch (error) {
        toast.error("Erro ao carregar modalidades");
      }
    };
    carregarModalidades();
  }, []);

  const handlePrivacidade = (tipo) => {
    setPrivacidade(tipo); 
  };

  const criandoEquipe = async () => {
    if (!nomeEquipe || !numeroMaximo || modalidade === 'Selecionar') {
      toast.info("Por favor, preencha todos os campos");
      return;
    }

    try {
      const novaEquipe = {
        NomeEquipe: nomeEquipe,
        isPublica: privacidade === "Público", 
        idResponsavel: 1, // Tem que ver esse item
        QtdMaxima: numeroMaximo,
        idModalidade: modalidades.find(mod => mod.Nome === modalidade)?.idModalidade 
      };

      const response = await criarEquipe(novaEquipe);
      toast.success("Equipe criada com sucesso!");
    } catch (error) {
      toast.error("Erro ao criar equipe: " + error);
    }
  };

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

        {/* <label>Local</label>
        <select value={local} onChange={(e) => setLocal(e.target.value)}>
          <option>Quadra</option>
        </select> */}

        <label> Número Máximo de Participantes</label>
        <input
          type="number"
          placeholder=""
          value={numeroMaximo}
          onChange={(e) => setNumeroMaximo(e.target.value)}
        />

        {/* <label>Data do Evento</label>
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
        </div> */}

        <label>Modalidade</label>
        <select value={modalidade} onChange={(e) => setModalidade(e.target.value)}>
          <option>Selecionar</option>
          {modalidades.map(mod => (
            <option key={mod.idModalidade} value={mod.Nome}>{mod.Nome}</option>
          ))}
        </select>

        <label>Privacidade</label>
        <div className="privacidade">
          <button
            className={`public ${privacidade === "Público" ? "active" : ""}`}
            onClick={() => handlePrivacidade("Público")} //true
          >Público
          </button>
          <button
            className={`private ${privacidade === "Privado" ? "active" : ""}`}
            onClick={() => handlePrivacidade("Privado")} //false
          >Privado
          </button>
        </div>

        <button className="register-button" onClick={criandoEquipe}>Registro</button>
      </div>
    </div>
  );
}

