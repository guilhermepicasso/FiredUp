import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { AuthProvider } from './Components/UserContext/AuthContext';
import HomeView from './Pages/Home/HomeView';
import Equipes from './Pages/Equipes';
import Login from "./Pages/Login/index";
import FormularioEquipe from './Pages/FormularioEquipe/index';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomeView />} />
          <Route path='/Equipes' element={<Equipes />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/FormularioEquipe' element={<FormularioEquipe />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </AuthProvider>
  </React.StrictMode>
);

