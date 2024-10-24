import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from './Pages/Exemplo/App';
import Login from "./Pages/Login/index";



export default function Navigation() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App />} />
                <Route path='/Login' element={<Login />} />
            </Routes>
        </BrowserRouter>
    )

}