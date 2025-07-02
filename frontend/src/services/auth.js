// src/services/auth.js
import api from './api';

// Login User
export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    const { token, user } = response.data;

    if (token) {
      localStorage.setItem('token', token);
    }

    return { token, user };
  } catch (error) {
    throw error.response?.data?.message || 'Login failed';
  }
};

// Register New User
export const register = async (username, email, password) => {
  try {
    const response = await api.post('/register', { username, email, password });
    // // const { token, user } = response.data;

    // if (token) {
    //   localStorage.setItem('token', token);
    // }

    // return { token, user };
  } catch (error) {
    throw error.response?.data?.message || 'Registration failed';
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
};

// Check if logged in
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};
