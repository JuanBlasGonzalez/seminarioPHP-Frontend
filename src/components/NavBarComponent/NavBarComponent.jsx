import { Link } from 'react-router-dom';

function NavBarComponent() {
  return (
    <nav>
      <Link to="/">Cotizaciones</Link>
      <Link to="/registro">Registro de usuario</Link>
      <Link to="/login">Login</Link>
    </nav>
  );
}

export default NavBarComponent;