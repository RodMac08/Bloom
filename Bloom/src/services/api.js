// src/services/api.js

import axios from 'axios';

// Creamos una instancia de Axios con configuración base
const apiClient = axios.create({
  baseURL: 'http://localhost:5001/api', // La URL base de tu API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Esto es un "interceptor". Es una función que se ejecuta ANTES de cada petición.
// Su trabajo es tomar el token del localStorage y añadirlo a los headers.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;