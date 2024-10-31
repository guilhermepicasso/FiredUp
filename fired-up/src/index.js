import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './Pages/Exemplo/App';
import HomeView from './Pages/Home/HomeView';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import reportWebVitals from './reportWebVitals';
import Navigation from './routes';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/Home' element={<HomeView />} />
      </Routes>
    </BrowserRouter>
    <ToastContainer />
    <Navigation />
  </React.StrictMode>
);


reportWebVitals();
