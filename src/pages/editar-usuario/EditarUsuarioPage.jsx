import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

function EditarUsuarioPage() {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || '',
    password: '',
    repeatPassword: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    password: '',
    repeatPassword: ''
  });

  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
      await api.put(`/users/${user.id}`, payload);
      updateUser({ name: form.name });
      setSuccess('Datos actualizados correctamente.');
    } catch (err) {
      setServerError(err.response?.data?.error || 'No se pudo actualizar el usuario.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <h2>Editar usuario</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} />
        <p>{errors.name}</p>

        <label>Nueva contraseña</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Dejar vacío para no cambiarla" />
        <p>{errors.password}</p>

        <label>Repetir contraseña</label>
        <input type="password" name="repeatPassword" value={form.repeatPassword} onChange={handleChange} />
        <p>{errors.repeatPassword}</p>

        {serverError && <p>{serverError}</p>}
        {success && <p>{success}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </main>
  );
}

export default EditarUsuarioPage;