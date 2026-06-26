function RegistroPage() {
  return (
    <main>
      <h2>Registro de usuario</h2>
      <form>
        <label>Email</label>
        <input type="email" name="email" />

        <label>Nombre</label>
        <input type="text" name="name" />

        <label>Contraseña</label>
        <input type="password" name="password" />

        <button type="submit">Registrarme</button>
      </form>
    </main>
  );
}

export default RegistroPage;