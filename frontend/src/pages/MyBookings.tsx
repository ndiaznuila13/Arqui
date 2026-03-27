import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface Reserva {
  id: string;
  estudianteId: string;
  tutorId: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: 'confirmada' | 'cancelada' | 'completada';
  penaltyReason: string | null;
  penaltyFee: string | null;
  estudiante?: { nombre: string; email: string };
  tutor?: { usuario: { nombre: string; email: string } };
}

const MyBookings: React.FC = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelando, setCancelando] = useState<string | null>(null);
  const [cancelPopup, setCancelPopup] = useState<{
    show: boolean;
    penaltyReason?: string | null;
    penaltyFee?: string | null;
  }>({ show: false });

  const fetchReservas = async () => {
    try {
      const res = await api.get('/reservas/mis-reservas');
      setReservas(res.data);
    } catch {
      setError('Error al cargar reservas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  const handleCancelar = async (id: string) => {
    if (!window.confirm('Estas seguro de que deseas cancelar esta reserva?')) return;
    setCancelando(id);
    try {
      const res = await api.put(`/reservas/${id}/cancelar`);
      const data = res.data;
      setCancelPopup({
        show: true,
        penaltyReason: data.penaltyReason,
        penaltyFee: data.penaltyFee,
      });
      await fetchReservas();
      setTimeout(() => setCancelPopup({ show: false }), 4000);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error al cancelar');
    } finally {
      setCancelando(null);
    }
  };

  if (loading) return <p style={{ marginTop: '20px' }}>Cargando reservas...</p>;
  if (error) return <div className="error-message" style={{ marginTop: '20px' }}>{error}</div>;

  // Formatear fecha correctamente para evitar problemas de timezone
  const formatFecha = (fechaStr: string) => {
    const date = new Date(fechaStr + 'T12:00:00');
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Mis Reservas</h2>
      {reservas.length === 0 ? (
        <p style={{ marginTop: '16px', color: '#666' }}>No tienes reservas aun.</p>
      ) : (
        <div style={{ marginTop: '16px' }}>
          {reservas.map((r) => (
            <div key={r.id} className="card" style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4>
                    Reserva - {formatFecha(r.fecha.split('T')[0])}
                  </h4>
                  <p style={{ color: '#666', marginTop: '4px' }}>
                    Horario: {r.horaInicio} - {r.horaFin}
                  </p>
                  {r.tutor && (
                    <p style={{ marginTop: '4px' }}>
                      <strong>Tutor:</strong> {r.tutor.usuario.nombre}
                    </p>
                  )}
                  {r.estudiante && (
                    <p style={{ marginTop: '4px' }}>
                      <strong>Estudiante:</strong> {r.estudiante.nombre}
                    </p>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge badge-${r.estado}`}>
                    {r.estado.toUpperCase()}
                  </span>
                </div>
              </div>

              {r.penaltyReason && (
                <div className="penalty-warning" style={{ marginTop: '8px' }}>
                  Penalizacion: ${r.penaltyFee} - {r.penaltyReason}
                </div>
              )}

              {r.estado === 'confirmada' && (
                <button
                  className="btn btn-danger"
                  style={{ marginTop: '12px' }}
                  onClick={() => handleCancelar(r.id)}
                  disabled={cancelando === r.id}
                >
                  {cancelando === r.id ? 'Cancelando...' : 'Cancelar Reserva'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Popup de cancelacion */}
      {cancelPopup.show && (
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
          onClick={() => setCancelPopup({ show: false })}
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
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                background: cancelPopup.penaltyReason ? '#fff3cd' : '#f8d7da',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '32px',
              }}
            >
              {cancelPopup.penaltyReason ? '&#9888;' : '&#10005;'}
            </div>
            <h3 style={{ color: '#721c24', margin: '0 0 12px' }}>
              Reserva Cancelada
            </h3>
            <p style={{ color: '#666', fontSize: '14px' }}>
              La reserva ha sido cancelada correctamente.
            </p>
            {cancelPopup.penaltyReason && (
              <div
                style={{
                  background: '#fff3cd',
                  padding: '12px',
                  borderRadius: '8px',
                  marginTop: '16px',
                  fontSize: '13px',
                  color: '#856404',
                }}
              >
                &#9888; Penalizacion aplicada: ${cancelPopup.penaltyFee}
                <br />
                {cancelPopup.penaltyReason}
              </div>
            )}
            <div
              style={{
                background: '#e3f2fd',
                padding: '12px',
                borderRadius: '8px',
                marginTop: '12px',
                fontSize: '13px',
                color: '#1a73e8',
              }}
            >
              &#128276; Se ha enviado una notificacion de cancelacion.
            </div>
            <button
              className="btn btn-secondary"
              style={{ marginTop: '16px' }}
              onClick={() => setCancelPopup({ show: false })}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
