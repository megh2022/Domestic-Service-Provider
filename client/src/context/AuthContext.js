import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      console.log('Validating token:', token ? 'Token present' : 'No token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const decoded = jwtDecode(token);
        console.log('Decoded token:', decoded);
        if (decoded.exp * 1000 < Date.now()) {
          console.log('Token expired');
          logout();
          return;
        }
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/validate-token`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Token validation response:', res.data);
        setUser(res.data.user);
        localStorage.setItem('userId', res.data.user.id);
      } catch (err) {
        console.error('Token validation failed:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };
    validateToken();
  }, []);

  const login = (token, userData) => {
    console.log('Logging in user:', userData);
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userData.id);
    setUser(userData);
  };

  const logout = () => {
    console.log('Logging out');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};