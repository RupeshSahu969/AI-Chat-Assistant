// src/services/api.js
import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:8080/api', 
   baseURL:'https://3d-visualization-and-manipulation-1.onrender.com/api'
  //https://3d-visualization-and-manipulation.onrender.com/api
});

// Attach token if exists
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========== AUTH ==========
export const getCurrentUser = async () => {
  const response = await api.get('/user'); // Gets list of user models
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post('/login', { email, password });
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const register = async (username, email, password) => {
  const response = await api.post('/register', { username, email, password });
  localStorage.setItem('token', response.data.token);
  return response.data;
};

// ========== MODEL ==========
export const getModels = async () => {
  const response = await api.get('/user');
  return response.data;
};

export const uploadModel = async (formData) => {
  const response = await api.post('/user/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const deleteModel = async (id) => {
  const response = await api.delete(`/user/${id}`);
  return response.data;
};
export const modelByID = async (id) => {
  const response = await api.get(`/user/${id}`);
  return response.data;
};

export const getModelFile = async (id) => {
  const response = await api.get(`/user/${id}/file`, {
    responseType: 'blob'
  });
  return response.data;
};

// ========== SCENE ==========
export const saveSceneState = async (modelId, state) => {
  const response = await api.post('/scene', { modelId, ...state });
  return response.data;
};

export const getSceneStates = async (modelId) => {
  const response = await api.get(`/scene/${modelId}`);
  return response.data;
};

export const applySceneState = async (sceneId) => {
  const response = await api.get(`/scene/apply/${sceneId}`);
  return response.data;
};

export default api;
