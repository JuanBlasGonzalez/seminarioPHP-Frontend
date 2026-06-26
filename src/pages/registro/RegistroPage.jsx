import { useState } from 'react';

function RegistroPage() {
  const [form, setForm] = useState({
    email: '',
    name: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    name: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <main>
      <h2>Registro de usuario</h2>
      <form>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <p>{errors.email}</p>

        <label>Nombre</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <p>{errors.name}</p>

        <label>Contraseña</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />
        <p>{errors.password}</p>

        <button type="submit">Registrarme</button>
      </form>
    </main>
  );
}

export default RegistroPage;