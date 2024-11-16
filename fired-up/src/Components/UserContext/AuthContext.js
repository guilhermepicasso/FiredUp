import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutos em milissegundos

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedTime = localStorage.getItem("loginTime");

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
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
