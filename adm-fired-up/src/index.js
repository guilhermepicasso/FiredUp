import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import App from './Pages/App';
import Reservas from './Pages/Reservas';
import Espaco from './Pages/Espaco';
import Modalidade from './Pages/CadastroModalidade';
import DisponibilidadeEspaco from './Pages/DisponibilidadeEspaco';
import ModalidadeEspaco from './Pages/ModalidadeEspaco';

import HomeViewADM from './Pages/HomeAdm';
import GerenciarReservas from './Pages/GerenciarReservas';
import GerenciarEspacos from './Pages/GerenciarEspacos';
import PDFViewer from './components/Footer/PDFViewer';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/TermoDeUso' element={<PDFViewer />} />
        <Route path='/HomeViewADM' element={<HomeViewADM />} />
        <Route path='/GerenciarReservas' element={<GerenciarReservas />} />
        <Route path='/GerenciarEspacos' element={<GerenciarEspacos />} />

        <Route path='/Espaco' element={<Espaco />} />
        <Route path='/Reservas' element={<Reservas />} />
        <Route path='/Modalidade' element={<Modalidade />} />
        <Route path='/Disponibilidade' element={<DisponibilidadeEspaco />} />
        <Route path='/ModalidadeEspaco' element={<ModalidadeEspaco />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  </React.StrictMode>
);
