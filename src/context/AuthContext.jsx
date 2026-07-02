import { createContext, useContext, useState, useEffect, useRef } from 'react';
import api, { setupInterceptors } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const logoutRef = useRef(null);

  const logout = async (callApi = true) => {
    if (callApi) {
      try {
        await api.post('/logout');
      } catch (err) {
        console.error('Error al cerrar sesion:', err);
      }
    }
    localStorage.removeItem('wally_token');
    localStorage.removeItem('wally_user');
    setUser(null);
  };

  logoutRef.current = logout;

  useEffect(() => {
    setupInterceptors((callApi) => logoutRef.current(callApi));

    const token = localStorage.getItem('wally_token');
    const storedUser = localStorage.getItem('wally_user');
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('wally_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('wally_token', token);
    localStorage.setItem('wally_user', JSON.stringify(userData));
    setUser(userData);
  };

  const updateUser = (partialData) => {
    setUser((prev) => {
      const updated = { ...prev, ...partialData };
      localStorage.setItem('wally_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}