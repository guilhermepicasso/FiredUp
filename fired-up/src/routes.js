import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from './Pages/Exemplo/App';
import Login from "./Pages/Login/index";
import HomeView from "./Pages/Home/HomeView"
import ProfilePage from "./Pages/ProfilePage/index"


export default function Navigation() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App />} />
                <Route path='/Login' element={<Login />} />
                <Route path='/Home' element={<HomeView />} />
                <Route path='/Perfil' element={<ProfilePage />} />
            </Routes>
        </BrowserRouter>
    )

}