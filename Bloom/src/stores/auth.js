// src/stores/auth.js
import { defineStore } from 'pinia'
import apiClient from '../services/api'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  // --- ESTADO (STATE) ---
  // Los datos que queremos guardar
  const token = ref(localStorage.getItem('authToken'))
  const user = ref(null) // Aquí guardaremos el objeto { name, email, ... }
  const router = useRouter()

  // --- ACCIONES (ACTIONS) ---
  // Funciones que modifican el estado

  // Acción para guardar datos después de un login/registro exitoso
  function setAuthData(tokenData, userData) {
    localStorage.setItem('authToken', tokenData)
    token.value = tokenData
    user.value = userData
  }

  // Acción para el login
  async function login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password })
    const { token, user } = response.data
    setAuthData(token, user)
    router.push('/Reviews') // Redirigir
  }

  // Acción para el registro
  async function register(payload) {
    const response = await apiClient.post('/auth/register', payload)
    const { token, user } = response.data
    setAuthData(token, user)
    router.push('/Reviews') // Redirigir
  }

  // Acción para cargar el usuario si ya existe un token (al recargar la pág)
  async function fetchUser() {
    if (!token.value) return // No hay token, no hacemos nada

    try {
      const response = await apiClient.get('/users/me')
      user.value = response.data
    } catch (error) {
      // Si el token es inválido (expiró, etc.)
      console.error('Error al cargar usuario, borrando token.', error)
      logout()
    }
  }

  // Acción para cerrar sesión
  function logout() {
    localStorage.removeItem('authToken')
    token.value = null
    user.value = null
    router.push('/login') // Mandar al login
  }

  async function uploadAvatar(file) {
    if (!token.value) throw new Error("No autenticado");

    const formData = new FormData();
    formData.append('avatar', file); // 'avatar' debe coincidir con el backend

    try {
      // Hacemos la petición PUT a la nueva ruta
      const response = await apiClient.put('/users/me/avatar', formData, {
        headers: {
          // Importante para la subida de archivos
          'Content-Type': 'multipart/form-data', 
        },
      });

      // Actualizamos el usuario en el store con la respuesta del backend
      user.value = response.data;

    } catch (error) {
      console.error("Error al subir avatar:", error);
      throw error; // Re-lanzamos para que el componente pueda manejarlo
    }
  }
  return { token, user, login, register, fetchUser, logout, uploadAvatar }
})