import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './EditarUsuarioPage.css';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

function EditarUsuarioPage() {
  const { id } = useParams();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const targetId = id || user?.id;
  const isEditingSelf = !id || Number(id) === Number(user?.id);

  const [form, setForm] = useState({ name: '', password: '', repeatPassword: '' });
  const [errors, setErrors] = useState({ name: '', password: '', repeatPassword: '' });
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingUser, setLoadingUser] = useState(!!id);

  useEffect(() => {
    if (isEditingSelf && user) {
      setForm((prev) => ({ ...prev, name: user.name }));
    } else if (targetId) {
      api.get(`/users/${targetId}`)
        .then((res) => setForm((prev) => ({ ...prev, name: res.data.name })))
        .catch(() => setServerError('No se pudo cargar el usuario.'))
        .finally(() => setLoadingUser(false));
    }
  }, [targetId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = { name: '', password: '', repeatPassword: '' };
    let isValid = true;

    if (!form.name.trim()) {
      newErrors.name = 'El nombre no puede estar vacío.';
      isValid = false;
    } else if (form.name.length > 30) {
      newErrors.name = 'Máximo 30 caracteres.';
      isValid = false;
    }

    if (form.password || form.repeatPassword) {
      if (!PASSWORD_REGEX.test(form.password)) {
        newErrors.password = 'Debe tener 8+ caracteres, mayúscula, minúscula, número y carácter especial.';
        isValid = false;
      }
      if (form.password !== form.repeatPassword) {
        newErrors.repeatPassword = 'Las contraseñas no coinciden.';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccess('');
    if (!validate()) return;

    const payload = { name: form.name };
    if (form.password) payload.password = form.password;

    setSubmitting(true);
    try {
      await api.put(`/users/${targetId}`, payload);
      setSuccess('Datos actualizados correctamente.');
      if (isEditingSelf) {
        updateUser({ name: form.name });
      } else {
        setTimeout(() => navigate('/usuarios'), 1200);
      }
    } catch (err) {
      setServerError(err.response?.data?.error || 'No se pudo actualizar el usuario.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingUser) return <p>Cargando usuario...</p>;

  return (
    <div className="editar-usuario-page">
      <h2>{isEditingSelf ? 'Editar mi usuario' : 'Editar usuario'}</h2>
      <form onSubmit={handleSubmit} className="editar-usuario-page__form" noValidate>
        <label className="editar-usuario-page__label">Nombre</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} />
        <p className="editar-usuario-page__error">{errors.name}</p>

        <label className="editar-usuario-page__label">Nueva contraseña</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Dejar vacío para no cambiarla"
        />
        <p className="editar-usuario-page__error">{errors.password}</p>

        <label className="editar-usuario-page__label">Repetir contraseña</label>
        <input
          type="password"
          name="repeatPassword"
          value={form.repeatPassword}
          onChange={handleChange}
        />
        <p className="editar-usuario-page__error">{errors.repeatPassword}</p>

        {serverError && <p className="editar-usuario-page__server-error">{serverError}</p>}
        {success && <p className="editar-usuario-page__success">{success}</p>}

        <button type="submit" disabled={submitting} className="btn">
          {submitting ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}

export default EditarUsuarioPage;