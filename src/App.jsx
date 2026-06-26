import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HeaderComponent from './components/HeaderComponent/HeaderComponent';
import FooterComponent from './components/FooterComponent/FooterComponent';
import NavBarComponent from './components/NavBarComponent/NavBarComponent';
import StatPage from './pages/stat/StatPage';
import RegistroPage from './pages/registro/RegistroPage';
import LoginPage from './pages/login/LoginPage';
import EditarUsuarioPage from './pages/editar-usuario/EditarUsuarioPage';
import PortfolioPage from './pages/portfolio/PortfolioPage';
import OperacionesPage from './pages/operaciones/OperacionesPage';
import PanelPage from './pages/panel/PanelPage';
import UsuariosPage from './pages/usuarios/UsuariosPage';

function App() {
  return (
    <BrowserRouter>
      <HeaderComponent />
      <NavBarComponent />
      <Routes>
        <Route path="/" element={<StatPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/editar-usuario" element={<EditarUsuarioPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/operaciones" element={<OperacionesPage />} />
        <Route path="/panel" element={<PanelPage />} />
        <Route path="/usuarios" element={<UsuariosPage />} />
      </Routes>
      <FooterComponent />
    </BrowserRouter>
  );
}

export default App;