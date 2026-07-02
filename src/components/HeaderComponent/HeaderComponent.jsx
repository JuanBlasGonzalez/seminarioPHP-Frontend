import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import './HeaderComponent.css';

function HeaderComponent() {
  return (
    <header className="header">
      <Link to="/" className="header__brand">
        <img
          src={logo}
          alt="Logo WALLy Street"
          className="header__logo"
        />
        <span className="header__title">WALLy Street</span>
      </Link>
    </header>
  );
}

export default HeaderComponent;