import React, { createContext, useContext, useState, useEffect } from 'react';
import { buscar } from '../../API/chamadas';

const AuthContext = createContext();

const EXPIRATION_TIME = 60 * 60 * 1000; // 1 hora em milissegundos

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [modalidades, setModalidades] = useState([])

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedTime = localStorage.getItem("loginTime");
        const fetchModalidades = async () => {
            try {
                const result = await buscar('modalidade')
                setModalidades(result);
            } catch (error) {
                console.log("erro ao buscar modalidades em AuthProvider!");
            }
        } 
        fetchModalidades();
        if (storedUser && storedTime) {
            const currentTime = new Date().getTime();
            if (currentTime - storedTime < EXPIRATION_TIME) {
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
            } else {
                localStorage.removeItem("user");
                localStorage.removeItem("loginTime");
            }
        }
    }, []);

    const login = (userData) => {
        const currentTime = new Date().getTime();
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("loginTime", currentTime);

        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("loginTime");

        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, modalidades }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};