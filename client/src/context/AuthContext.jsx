import React, { createContext, useState, useEffect } from 'react';
import { auth as authApi } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('campushub_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await authApi.getCurrentUser();
          setUser(res.data.data);
        } catch (error) {
          console.error("Failed to load user", error);
          setToken(null);
          setUser(null);
          localStorage.removeItem('campushub_token');
          localStorage.removeItem('campushub_user');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await authApi.loginUser({ email, password });
    const { token: newToken, user: userData } = res.data.data;
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('campushub_token', newToken);
    localStorage.setItem('campushub_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('campushub_token');
    localStorage.removeItem('campushub_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
