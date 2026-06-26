import { Link } from 'react-router-dom';

function HeaderComponent() {
  return (
    <header>
      <Link to="/">
        <img src="https://placehold.co/40x40" alt="Logo WALLy Street" />
        <h1>WALLy Street</h1>
      </Link>
    </header>
  );
}

export default HeaderComponent;