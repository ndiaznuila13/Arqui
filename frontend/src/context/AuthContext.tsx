import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import api from '../services/api';

interface User {
    id: string;
    nombre: string;
    email: string;
    rol: 'estudiante' | 'tutor';
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (data: { email: string; password: string; nombre: string; rol: string }) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
    }, []);

    const login = async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        const { token, usuario } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(usuario));
        setUser(usuario);
    };

    const register = async (data: { email: string; password: string; nombre: string; rol: string }) => {
        const response = await api.post('/auth/registro', data);
        const { token, usuario } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(usuario));
        setUser(usuario);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
    return context;
};
