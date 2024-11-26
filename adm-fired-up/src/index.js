import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { AuthProvider } from './components/UserContext/AuthContext';

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
import LoginADM from './Pages/LoginADM';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginADM />} />
          <Route path='/App' element={<App />} />
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
    </AuthProvider>
  </React.StrictMode>
);
