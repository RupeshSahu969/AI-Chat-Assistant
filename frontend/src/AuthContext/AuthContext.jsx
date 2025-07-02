import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as authLogin, register as authRegister } from '../services/auth';
import {jwtDecode} from 'jwt-decode';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);


 const login = async (email, password) => {
  const response = await authLogin(email, password); // returns { token }

  const decoded = jwtDecode(response.token); // decode token payload

  const user = {
    token: response.token,
    email: decoded.email,
    username: decoded.username
  };

  localStorage.setItem('user', JSON.stringify(user));
  setCurrentUser(user);
  return user;
};

  const register = async (username, email, password) => {
    const user = await authRegister(username, email, password);
    // localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
    return user;
  };
 const logout = () => {
  // console.log('Logging out...');
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  setCurrentUser(null);
};

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);