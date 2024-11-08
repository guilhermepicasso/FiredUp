import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import App from './Pages/App';
import Reservas from './Pages/Reservas';
import Espaco from './Pages/Espaco';
import Modalidade from './Pages/CadastroModalidade';
import DisponibilidadeEspaco from './Pages/DisponibilidadeEspaco';
import ModalidadeEspaco from './Pages/ModalidadeEspaco';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='/Espaco' element={<Espaco />} />
          <Route path='/Reservas' element={<Reservas />} />
          <Route path='/Modalidade' element={<Modalidade />} />
          <Route path='/Disponibilidade' element={<DisponibilidadeEspaco />} />
          <Route path='/ModalidadeEspaco' element={<ModalidadeEspaco />} />
        </Routes>
      </BrowserRouter>
  </React.StrictMode>
);
