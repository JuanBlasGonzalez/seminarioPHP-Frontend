import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (token, userData) => {
    localStorage.setItem('wally_token', token);
    localStorage.setItem('wally_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('wally_token');
    localStorage.removeItem('wally_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );    
}

export function useAuth() {
  return useContext(AuthContext);
}