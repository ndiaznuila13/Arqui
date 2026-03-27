import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Tutor {
  id: string;
  materias: string[];
  tarifaHora: string;
  biografia: string | null;
  usuario: {
    id: string;
    nombre: string;
    email: string;
  };
}

const TutorList: React.FC = () => {
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTutores = async () => {
      try {
        const res = await api.get('/tutores');
        setTutores(res.data);
      } catch (err: any) {
        setError('Error al cargar tutores');
      } finally {
        setLoading(false);
      }
    };
    fetchTutores();
  }, []);

  if (loading) return <p style={{ marginTop: '20px' }}>Cargando tutores...</p>;
  if (error) return <div className="error-message" style={{ marginTop: '20px' }}>{error}</div>;

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Tutores Disponibles</h2>
      {tutores.length === 0 ? (
        <p style={{ marginTop: '16px', color: '#666' }}>No hay tutores registrados aun.</p>
      ) : (
        <div className="grid" style={{ marginTop: '16px' }}>
          {tutores.map((tutor) => (
            <div key={tutor.id} className="card tutor-card">
              <h3>{tutor.usuario.nombre}</h3>
              <p style={{ color: '#666', fontSize: '14px' }}>{tutor.usuario.email}</p>
              <div style={{ margin: '10px 0' }}>
                {tutor.materias.map((m, i) => (
                  <span key={i} className="badge badge-materia">{m}</span>
                ))}
              </div>
              <p><strong>Tarifa:</strong> ${tutor.tarifaHora}/hora</p>
              {tutor.biografia && (
                <p style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>{tutor.biografia}</p>
              )}
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/tutores/${tutor.id}`)}
                >
                  Ver Disponibilidad
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(`/reservar/${tutor.id}`)}
                >
                  Reservar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TutorList;
