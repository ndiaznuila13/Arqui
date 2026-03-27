import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Bienvenido, {user?.nombre}</h2>
      <p style={{ color: '#666', marginTop: '8px' }}>
        Rol: <strong>{user?.rol}</strong>
      </p>

      <div className="grid" style={{ marginTop: '24px' }}>
        <div className="card" onClick={() => navigate('/tutores')} style={{ cursor: 'pointer' }}>
          <h3>Buscar Tutores</h3>
          <p style={{ color: '#666', marginTop: '8px' }}>
            Explora la lista de tutores disponibles y consulta sus horarios.
          </p>
        </div>

        <div className="card" onClick={() => navigate('/mis-reservas')} style={{ cursor: 'pointer' }}>
          <h3>Mis Reservas</h3>
          <p style={{ color: '#666', marginTop: '8px' }}>
            Consulta, gestiona o cancela tus reservas de tutorias.
          </p>
        </div>

        {user?.rol === 'tutor' && (
          <div className="card" onClick={() => navigate('/tutor-panel')} style={{ cursor: 'pointer', borderLeft: '4px solid #28a745' }}>
            <h3>Panel de Tutor</h3>
            <p style={{ color: '#666', marginTop: '8px' }}>
              Gestiona tu perfil, materias, tarifa y horarios de disponibilidad.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
