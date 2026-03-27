import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationPopup from './NotificationPopup';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'Inicio' },
        { path: '/tutores', label: 'Tutores' },
        { path: '/mis-reservas', label: 'Mis Reservas' },
        ...(user?.rol === 'tutor'
            ? [{ path: '/tutor-panel', label: 'Mi Panel Tutor' }]
            : []),
    ];

    return (
        <nav className="navbar">
            <h1>Tutorias MVP</h1>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {navItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        style={{
                            background: location.pathname === item.path ? 'rgba(255,255,255,0.3)' : 'transparent',
                            border: 'none',
                            color: 'white',
                            padding: '8px 14px',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            fontWeight: location.pathname === item.path ? '700' : '400',
                        }}
                    >
                        {item.label}
                    </button>
                ))}
                <span style={{ margin: '0 8px', opacity: 0.7 }}>|</span>
                <NotificationPopup />
                <span style={{ fontSize: '14px' }}>
                    {user?.nombre} ({user?.rol})
                </span>
                <button onClick={handleLogout}>Salir</button>
            </div>
        </nav>
    );
};

export default Navbar;