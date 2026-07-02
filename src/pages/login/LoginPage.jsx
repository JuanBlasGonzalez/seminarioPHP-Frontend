import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './LoginPage.css';

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Completá email y contraseña.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/login', form);
      login(response.data.token, {
        id: response.data.id,
        name: response.data.name,
        isAdmin: response.data.is_admin,
        balance: response.data.balance
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Email o contraseña incorrectos.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit} className="login-page__form" noValidate>
        <label className="login-page__label">Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} />

        <label className="login-page__label">Contraseña</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} />

        {error && <p className="login-page__error">{error}</p>}

        <button type="submit" disabled={submitting} className="btn">
          {submitting ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <p className="login-page__footer-link">
        ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
      </p>
    </div>
  );
}

export default LoginPage;