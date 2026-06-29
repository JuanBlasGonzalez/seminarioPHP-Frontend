import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

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
        isAdmin: response.data.is_admin
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Email o contraseña incorrectos.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} />

        <label>Contraseña</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} />

        {error && <p>{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </main>
  );
}

export default LoginPage;