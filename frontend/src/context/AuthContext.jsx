import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session from localStorage on startup
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem('campusfix_auth');
      const storedUser = localStorage.getItem('campusfix_currentUser');

      if (storedAuth) {
        const parsedAuth = JSON.parse(storedAuth);
        setUser(parsedAuth.user);
        setToken(parsedAuth.token);
      } else if (storedUser) {
        setUser(JSON.parse(storedUser));
        setToken('mock-token');
      }
    } catch (err) {
      console.error('Failed to parse auth session from localStorage', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData, authToken = 'mock-jwt-token') => {
    const session = {
      token: authToken,
      user: userData,
      loginAt: new Date().toISOString(),
    };
    localStorage.setItem('campusfix_auth', JSON.stringify(session));
    localStorage.setItem('campusfix_currentUser', JSON.stringify(userData));
    setUser(userData);
    setToken(authToken);
  };

  const logout = () => {
    localStorage.removeItem('campusfix_auth');
    localStorage.removeItem('campusfix_currentUser');
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    role: user?.role || null,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
