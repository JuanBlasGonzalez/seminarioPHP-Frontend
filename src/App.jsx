import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute/ProtectedRoute';
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
      <AuthProvider>
        <HeaderComponent />
        <NavBarComponent />
        <Routes>
          <Route path="/" element={<StatPage />} />
          <Route path="/registro" element={<RegistroPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/panel" element={<PanelPage />} />
          <Route path="/portfolio" element={
            <ProtectedRoute>
              <PortfolioPage />
            </ProtectedRoute>
          } />
          <Route path="/operaciones" element={
            <ProtectedRoute>
              <OperacionesPage />
            </ProtectedRoute>
          } />
          <Route path="/editar-usuario" element={
            <ProtectedRoute>
              <EditarUsuarioPage />
            </ProtectedRoute>
          } />
          <Route path="/usuarios" element={
            <AdminRoute>
              <UsuariosPage />
            </AdminRoute>
          } />
        </Routes>
        <FooterComponent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;