import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function NavBarComponent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) {
    return (
      <nav>
        <Link to="/">Cotizaciones</Link>
        <Link to="/registro">Registro de usuario</Link>
        <Link to="/login">Login</Link>
      </nav>
    );
  }

  return (
    <nav>
      <Link to="/">Cotizaciones</Link>
      <span>Hola, {user.name}</span>
      <Link to="/portfolio">Mi portfolio</Link>
      <Link to="/operaciones">Mis operaciones</Link>
      <Link to="/panel">Ver Panel</Link>
      <Link to="/editar-usuario">Editar usuario</Link>
      {user.isAdmin && <Link to="/usuarios">Manejo usuarios</Link>}
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}

export default NavBarComponent;