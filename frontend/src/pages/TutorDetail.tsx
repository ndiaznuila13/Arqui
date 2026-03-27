import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const DIAS = ['', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

interface Disponibilidad {
  id: string;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  activo: boolean;
}

interface TutorInfo {
  id: string;
  materias: string[];
  tarifaHora: string;
  biografia: string | null;
  usuario: { nombre: string; email: string };
  disponibilidades: Disponibilidad[];
}

const TutorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tutor, setTutor] = useState<TutorInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const res = await api.get(`/tutores/${id}`);
        setTutor(res.data);
      } catch {
        setTutor(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTutor();
  }, [id]);

  if (loading) return <p style={{ marginTop: '20px' }}>Cargando...</p>;
  if (!tutor) return <div className="error-message" style={{ marginTop: '20px' }}>Tutor no encontrado</div>;

  return (
    <div style={{ marginTop: '20px' }}>
      <button className="btn btn-secondary" onClick={() => navigate('/tutores')}>
        Volver
      </button>
      <div className="card" style={{ marginTop: '16px' }}>
        <h2>{tutor.usuario.nombre}</h2>
        <p style={{ color: '#666' }}>{tutor.usuario.email}</p>
        <div style={{ margin: '10px 0' }}>
          {tutor.materias.map((m, i) => (
            <span key={i} className="badge badge-materia">{m}</span>
          ))}
        </div>
        <p><strong>Tarifa:</strong> ${tutor.tarifaHora}/hora</p>
        {tutor.biografia && <p style={{ marginTop: '8px' }}>{tutor.biografia}</p>}
      </div>

      <div className="card" style={{ marginTop: '16px' }}>
        <h3>Disponibilidad</h3>
        {tutor.disponibilidades.length === 0 ? (
          <p style={{ color: '#666', marginTop: '8px' }}>Sin disponibilidad registrada.</p>
        ) : (
          <table style={{ marginTop: '12px' }}>
            <thead>
              <tr>
                <th>Dia</th>
                <th>Hora Inicio</th>
                <th>Hora Fin</th>
              </tr>
            </thead>
            <tbody>
              {tutor.disponibilidades.map((d) => (
                <tr key={d.id}>
                  <td>{DIAS[d.diaSemana]}</td>
                  <td>{d.horaInicio}</td>
                  <td>{d.horaFin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button
          className="btn btn-primary"
          style={{ marginTop: '16px' }}
          onClick={() => navigate(`/reservar/${tutor.id}`)}
        >
          Reservar con este tutor
        </button>
      </div>
    </div>
  );
};

export default TutorDetail;
