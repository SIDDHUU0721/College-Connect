import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth: Strictly check if a valid JWT session exists
  useEffect(() => {
    async function initAuth() {
      const token = localStorage.getItem('cc_auth_token');
      if (token) {
        try {
          const meRes = await api.get('/auth/me');
          if (meRes.success) {
            setUser(meRes.user);
          } else {
            localStorage.removeItem('cc_auth_token');
            setUser(null);
          }
        } catch (err) {
          localStorage.removeItem('cc_auth_token');
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    }
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success) {
      localStorage.setItem('cc_auth_token', res.token);
      setUser(res.user);
      return res.user;
    }
  };

  const register = async (payload) => {
    const res = await api.post('/auth/register', payload);
    if (res.success) {
      localStorage.setItem('cc_auth_token', res.token);
      setUser(res.user);
      return res.user;
    }
  };

  const logout = () => {
    localStorage.removeItem('cc_auth_token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isStudent: user?.role === 'student',
    isTeacher: user?.role === 'teacher',
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
