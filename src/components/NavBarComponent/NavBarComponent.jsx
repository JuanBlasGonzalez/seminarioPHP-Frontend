import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './NavBarComponent.css';

function NavBarComponent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) {
    return (
      <nav className="navbar">
        <div className="navbar__container">
          <Link to="/" className="navbar__link">Cotizaciones</Link>
          <Link to="/registro" className="navbar__link">Registro de usuario</Link>
          <Link to="/login" className="navbar__link navbar__link--cta">Login</Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <span className="navbar__greeting">Hola, {user.name}</span>
        <Link to="/portfolio" className="navbar__link">Mi portfolio</Link>
        <Link to="/operaciones" className="navbar__link">Mis operaciones</Link>
        <Link to="/panel" className="navbar__link">Ver Panel</Link>
        <Link to="/editar-usuario" className="navbar__link">Editar usuario</Link>
        {user.isAdmin && (
          <Link to="/usuarios" className="navbar__link">Manejo usuarios</Link>
        )}
        <button onClick={handleLogout} className="navbar__link navbar__link--logout">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default NavBarComponent;