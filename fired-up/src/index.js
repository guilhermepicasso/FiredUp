import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { AuthProvider } from './Components/UserContext/AuthContext';
import UserPage from './Pages/UserPage';
import PrivateRoute from './Components/UserContext/PrivateRoute';
import HomeView from './Pages/Home/HomeView';
import Equipes from './Pages/Equipes';
import Login from "./Pages/Login/index";
import FormularioEquipe from './Pages/FormularioEquipe/index';
import ProfilePage from './Pages/ProfilePage';
import PDFViewer from './Components/Footer/PDFViewer';

import FormularioReserva from './Pages/FormularioReserva/index2';
import App from "./Pages/FormularioReserva/teste";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomeView />} />
          <Route path='/TermoDeUso' element={<PDFViewer />} />
          <Route path='/Equipes' element={<Equipes />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/FormularioEquipe' element={<FormularioEquipe />} />
          <Route path='/FormularioReserva' element={<FormularioReserva />} />
          <Route path='/App' element={<App />} />
          <Route 
            path="/UserPage" 
            element={
              <PrivateRoute>
                <UserPage />
              </PrivateRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </AuthProvider>
  </React.StrictMode>
);

