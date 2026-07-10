import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {getAllUsersService, updateUserService, getUserService, deleteUserService} from '../../services/user.services';
import { validateName, validatePassword, validatePasswordMatch } from '../../utils/validations';
import './EditarUsuarioPage.css';

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
      getUserService(targetId)
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
    newErrors.name = validateName(form.name);
    if (form.password || form.repeatPassword) {
      newErrors.password = validatePassword(form.password);
      newErrors.repeatPassword = validatePasswordMatch(form.password, form.repeatPassword);
    }
    setErrors(newErrors);
    return !Object.values(newErrors).some((e) => e !== '');
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
      await updateUserService(targetId, payload);
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