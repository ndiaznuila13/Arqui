import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateBooking: React.FC = () => {
  const { tutorId } = useParams<{ tutorId: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fecha: '',
    horaInicio: '',
    horaFin: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/reservas', {
        tutorId,
        fecha: form.fecha,
        horaInicio: form.horaInicio,
        horaFin: form.horaFin,
      });
      setSuccess('Reserva creada exitosamente!');
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate('/mis-reservas');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  // Fecha minima: hoy
  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ marginTop: '20px', maxWidth: '500px' }}>
      <button className="btn btn-secondary" onClick={() => navigate(-1)}>
        Volver
      </button>
      <div className="card" style={{ marginTop: '16px' }}>
        <h2>Crear Reserva</h2>
        {error && <div className="error-message">{error}</div>}
        {success && !showPopup && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} style={{ marginTop: '16px' }}>
          <div className="form-group">
            <label>Fecha:</label>
            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              min={today}
              required
            />
          </div>
          <div className="form-group">
            <label>Hora Inicio (HH:MM):</label>
            <input
              type="time"
              name="horaInicio"
              value={form.horaInicio}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Hora Fin (HH:MM):</label>
            <input
              type="time"
              name="horaFin"
              value={form.horaFin}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Confirmar Reserva'}
          </button>
        </form>
      </div>

      {/* Popup de notificacion */}
      {showPopup && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '420px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
              animation: 'fadeIn 0.3s ease-out',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                background: '#d4edda',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '32px',
              }}
            >
              &#10003;
            </div>
            <h3 style={{ color: '#155724', margin: '0 0 12px' }}>
              Reserva Confirmada!
            </h3>
            <p style={{ color: '#666', margin: '0 0 8px', fontSize: '14px' }}>
              Tu reserva para el <strong>{form.fecha}</strong> de{' '}
              <strong>{form.horaInicio}</strong> a <strong>{form.horaFin}</strong> ha
              sido creada exitosamente.
            </p>
            <div
              style={{
                background: '#e3f2fd',
                padding: '12px',
                borderRadius: '8px',
                marginTop: '16px',
                fontSize: '13px',
                color: '#1a73e8',
              }}
            >
              &#128276; Se ha enviado una notificacion de confirmacion. Revisa la
              campana de notificaciones.
            </div>
            <p style={{ color: '#999', marginTop: '16px', fontSize: '12px' }}>
              Redirigiendo a tus reservas...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateBooking;
