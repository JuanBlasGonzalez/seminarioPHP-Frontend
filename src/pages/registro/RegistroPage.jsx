import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {registroService} from '../../services/auth.services';
import { validateEmail, validateName, validatePassword } from '../../utils/validations';
import './RegistroPage.css';  

function RegistroPage() {
  const [form, setForm] = useState({ email: '', name: '', password: '' });
  const [errors, setErrors] = useState({ email: '', name: '', password: '' });
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {
      email: validateEmail(form.email),
      name: validateName(form.name),
      password: validatePassword(form.password)
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((e) => e !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await registroService(form);
      navigate('/login');
    } catch (err) {
      setServerError(err.response?.data?.error || 'No se pudo completar el registro.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="registro-page">
      <h2>Registro de usuario</h2>
      <form onSubmit={handleSubmit} className="registro-page__form" noValidate>
        <label className="registro-page__label">Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} />
        <p className="registro-page__error">{errors.email}</p>

        <label className="registro-page__label">Nombre</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} />
        <p className="registro-page__error">{errors.name}</p>

        <label className="registro-page__label">Contraseña</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} />
        <p className="registro-page__error">{errors.password}</p>

        {serverError && <p className="registro-page__server-error">{serverError}</p>}

        <button type="submit" disabled={submitting} className="btn">
          {submitting ? 'Registrando...' : 'Registrarme'}
        </button>
      </form>

      <p className="registro-page__footer-link">
        ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
      </p>
    </div>
  );
}

export default RegistroPage;