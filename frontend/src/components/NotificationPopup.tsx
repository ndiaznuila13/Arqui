import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

interface Notification {
    id: number;
    tipo: string;
    destinatario: string;
    asunto: string;
    mensaje: string;
    fechaEnvio: string;
    leida: boolean;
}

const NotificationPopup: React.FC = () => {
    const [notificaciones, setNotificaciones] = useState<Notification[]>([]);
    const [showPanel, setShowPanel] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotificaciones = useCallback(async () => {
        try {
            const res = await api.get('/notificaciones/no-leidas');
            setUnreadCount(res.data.count);
            setNotificaciones(res.data.notificaciones);
        } catch {
            // Silently fail, notifications are optional
        }
    }, []);

    useEffect(() => {
        fetchNotificaciones();
        // Poll cada 5 segundos para nuevas notificaciones
        const interval = setInterval(fetchNotificaciones, 5000);
        return () => clearInterval(interval);
    }, [fetchNotificaciones]);

    const mercarLeida = async (id: number) => {
        try {
            await api.put(`/notificaciones/${id}/leer`);
            setNotificaciones(prev => prev.filter(n => n.id !== id));
            setUnreadCount((prev) => Math.max(prev - 1));
        } catch {
            // Silently fail
        }
    };

    const marcarTodasLeidas = async () => {
        try {
            for (const n of notificaciones) {
                await api.put(`/notificaciones/${n.id}/leer`);
            }
            setNotificaciones([]);
            setUnreadCount(0);
        } catch {
            // Silently fail
        }
    };

    return (
        <>
        {/* Boton de campana con contador */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
                onClick={() => setShowPanel(!showPanel)}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    fontSize: '18px',
                    cursor: 'pointer',
                    padding: '8px',
                    position: 'relative',
                }}
                title="Notificaciones"
            >
            &#128276; {/* Bell emoji */}
            {unreadCount > 0 && (
                <span
                    style={{
                        position: 'absolute',
                        top: '2px',
                        right: '0px',
                        background: '#dc3545',
                        color: 'white',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {unreadCount}
                </span>
            )}
            </button>
        </div>

        {/* Panel de notificaciones */}
        {showPanel && (
            <div
                style={{
                    position: 'fixed',
                    top: '60px',
                    right: '20px',
                    width: '380px',
                    maxHeight: '500px',
                    background: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                    zIndex: 1000,
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        padding: '14px 16px',
                        borderBottom: '1px solid #eee',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: '#f8f9fa',
                    }}
                >
                    <h4 style={{ margin: 0, color: '#333', fontSize: '15px' }}>
                        Notificaciones ({unreadCount})
                    </h4>
                    {notificaciones.length > 0 && (
                        <button
                            onClick={marcarTodasLeidas}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#1a73e8',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '600',
                            }}
                        >
                            Marcar todas leidas
                        </button>
                    )}
                </div>

                <div style={{ overflowY: 'auto', maxHeight: '420px' }}>
                    {notificaciones.length === 0 ? (
                        <div
                            style={{
                                padding: '30px 16px',
                                textAlign: 'center',
                                color: '#999',
                            }}
                        >
                            No tienes notificaciones nuevas
                        </div>
                    ) : (
                        notificaciones.map((n) => (
                            <div
                                key={n.id}
                                style={{
                                    padding: '14px 16px',
                                    borderBottom: '1px solid #f0f0f0',
                                    cursor: 'pointer',
                                    background: '#fffde7',
                                    transition: 'background 0.2s',
                                }}
                                onClick={() => mercarLeida(n.id)}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                    }}
                                >
                                    <strong
                                        style={{
                                            fontSize: '13px',
                                            color: '#333',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                        }}
                                    >
                                        {n.tipo === 'email' ? '&#9993;' : '&#128276;'} {n.asunto}
                                    </strong>
                                    <span
                                        style={{
                                            fontSize: '11px',
                                            color: '#999',
                                            whiteSpace: 'nowrap',
                                            marginLeft: '8px',
                                        }}
                                    >
                                        {new Date(n.fechaEnvio).toLocaleTimeString('es-ES', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                                <p
                                    style={{
                                        margin: '6px 0',
                                        fontSize: '13px',
                                        color: '#555',
                                        lineHeight: '1.4',
                                    }}
                                >
                                    {n.mensaje}
                                </p>
                                <small style={{ color: '#1a73e8', fontSize: '11px' }}>
                                    Click para marcar como leida
                                </small>
                            </div>
                        ))
                    )}
                </div>
            </div>
        )}

        {/* Overlay para cerrar */}
        {showPanel && (
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 999,
                }}
                onClick={() => setShowPanel(false)}
            />
        )}
        </>
    );
};

export default NotificationPopup;