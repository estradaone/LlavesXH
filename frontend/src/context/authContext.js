import React, { createContext, useState, useEffect } from "react";
import { API_URL } from "../config/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true); // para evitar parpadeos

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsLoggedIn(false);
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${API_URL}/admin/verify`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.ok) {
                    setIsLoggedIn(true);
                } else {
                    localStorage.removeItem("token");
                    setIsLoggedIn(false);
                }
            } catch (err) {
                localStorage.removeItem("token");
                setIsLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };

        checkToken();
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
