import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const DIAS: Record<number, string> = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miercoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sabado',
  7: 'Domingo',
};

interface Disponibilidad {
  id: string;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  activo: boolean;
}

interface TutorProfile {
  id: string;
  materias: string[];
  tarifaHora: string;
  biografia: string | null;
  disponibilidades: Disponibilidad[];
}

const TutorPanel: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form para crear perfil
  const [materias, setMaterias] = useState('');
  const [tarifaHora, setTarifaHora] = useState('');
  const [biografia, setBiografia] = useState('');
  const [creatingProfile, setCreatingProfile] = useState(false);

  // Form para disponibilidad
  const [diaSemana, setDiaSemana] = useState('1');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [addingDisp, setAddingDisp] = useState(false);

  const fetchPerfil = async () => {
    try {
      const res = await api.get(`/tutores/${user!.id}`);
      setPerfil(res.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setPerfil(null); // No tiene perfil aun
      } else {
        setError('Error al cargar perfil de tutor');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.rol !== 'tutor') {
      navigate('/dashboard');
      return;
    }
    fetchPerfil();
  }, []);

  const handleCrearPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setCreatingProfile(true);

    try {
      const materiasArray = materias.split(',').map((m) => m.trim()).filter(Boolean);
      if (materiasArray.length === 0) {
        setError('Debes ingresar al menos una materia');
        setCreatingProfile(false);
        return;
      }

      await api.post('/tutores', {
        materias: materiasArray,
        tarifaHora: parseFloat(tarifaHora),
        biografia: biografia || undefined,
      });

      setSuccess('Perfil de tutor creado exitosamente!');
      await fetchPerfil();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear perfil');
    } finally {
      setCreatingProfile(false);
    }
  };

  const handleAgregarDisponibilidad = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setAddingDisp(true);

    try {
      await api.post('/disponibilidad', {
        diaSemana: parseInt(diaSemana),
        horaInicio,
        horaFin,
      });

      setSuccess('Horario agregado exitosamente!');
      setHoraInicio('');
      setHoraFin('');
      await fetchPerfil();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al agregar horario');
    } finally {
      setAddingDisp(false);
    }
  };

  if (loading) return <p style={{ marginTop: '20px' }}>Cargando...</p>;

  return (
    <div style={{ marginTop: '20px', maxWidth: '800px' }}>
      <h2>Panel de Tutor</h2>

      {error && <div className="error-message" style={{ marginTop: '16px' }}>{error}</div>}
      {success && <div className="success-message" style={{ marginTop: '16px' }}>{success}</div>}

      {!perfil ? (
        /* Crear perfil de tutor */
        <div className="card" style={{ marginTop: '16px' }}>
          <h3>Crear tu perfil de tutor</h3>
          <p style={{ color: '#666', marginTop: '8px', marginBottom: '16px' }}>
            Completa la informacion para que los estudiantes puedan encontrarte.
          </p>

          <form onSubmit={handleCrearPerfil}>
            <div className="form-group">
              <label>Materias (separadas por coma):</label>
              <input
                type="text"
                value={materias}
                onChange={(e) => setMaterias(e.target.value)}
                placeholder="Ej: Matematicas, Calculo, Algebra"
                required
              />
            </div>
            <div className="form-group">
              <label>Tarifa por hora ($):</label>
              <input
                type="number"
                step="0.01"
                min="1"
                value={tarifaHora}
                onChange={(e) => setTarifaHora(e.target.value)}
                placeholder="Ej: 25.00"
                required
              />
            </div>
            <div className="form-group">
              <label>Biografia (opcional):</label>
              <textarea
                value={biografia}
                onChange={(e) => setBiografia(e.target.value)}
                placeholder="Describe tu experiencia, metodologia, etc."
                rows={3}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={creatingProfile}>
              {creatingProfile ? 'Creando...' : 'Crear Perfil de Tutor'}
            </button>
          </form>
        </div>
      ) : (
        /* Perfil ya existe - mostrar info y formulario de disponibilidad */
        <>
          <div className="card" style={{ marginTop: '16px' }}>
            <h3>Tu Perfil</h3>
            <div style={{ marginTop: '12px' }}>
              <p><strong>Materias:</strong></p>
              <div style={{ margin: '8px 0' }}>
                {perfil.materias.map((m, i) => (
                  <span key={i} className="badge badge-materia">{m}</span>
                ))}
              </div>
              <p><strong>Tarifa:</strong> ${perfil.tarifaHora}/hora</p>
              {perfil.biografia && (
                <p style={{ marginTop: '8px' }}><strong>Biografia:</strong> {perfil.biografia}</p>
              )}
            </div>
          </div>

          {/* Horarios actuales */}
          <div className="card" style={{ marginTop: '16px' }}>
            <h3>Tus Horarios de Disponibilidad</h3>
            {perfil.disponibilidades && perfil.disponibilidades.length > 0 ? (
              <table style={{ marginTop: '12px' }}>
                <thead>
                  <tr>
                    <th>Dia</th>
                    <th>Hora Inicio</th>
                    <th>Hora Fin</th>
                  </tr>
                </thead>
                <tbody>
                  {perfil.disponibilidades
                    .sort((a, b) => a.diaSemana - b.diaSemana || a.horaInicio.localeCompare(b.horaInicio))
                    .map((d) => (
                      <tr key={d.id}>
                        <td>{DIAS[d.diaSemana] || `Dia ${d.diaSemana}`}</td>
                        <td>{d.horaInicio}</td>
                        <td>{d.horaFin}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: '#666', marginTop: '12px' }}>
                No tienes horarios definidos aun. Agrega uno abajo.
              </p>
            )}
          </div>

          {/* Agregar nuevo horario */}
          <div className="card" style={{ marginTop: '16px' }}>
            <h3>Agregar Horario</h3>
            <form onSubmit={handleAgregarDisponibilidad} style={{ marginTop: '12px' }}>
              <div className="form-group">
                <label>Dia de la semana:</label>
                <select
                  value={diaSemana}
                  onChange={(e) => setDiaSemana(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
                >
                  {Object.entries(DIAS).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Hora inicio:</label>
                  <input
                    type="time"
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Hora fin:</label>
                  <input
                    type="time"
                    value={horaFin}
                    onChange={(e) => setHoraFin(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={addingDisp}>
                {addingDisp ? 'Agregando...' : 'Agregar Horario'}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default TutorPanel;
