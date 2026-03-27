import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    nombre: '',
    rol: 'estudiante',
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.details?.[0]?.mensaje || 'Error al registrar';
      setError(msg);
    }
  };

  return (
    <div className="auth-container">
      <div className="card">
        <h2>Registro</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre completo:</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Contrasena:</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimo 6 caracteres"
              required
              minLength={6}
            />
          </div>
          <div className="form-group">
            <label>Rol:</label>
            <select name="rol" value={form.rol} onChange={handleChange}>
              <option value="estudiante">Estudiante</option>
              <option value="tutor">Tutor</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Registrarse
          </button>
        </form>
        <div className="toggle-link">
          <p>
            Ya tienes cuenta?{' '}
            <a onClick={() => navigate('/login')}>Inicia sesion</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
