import { defineStore } from 'pinia'
import apiClient from '../services/api'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {

  const token = ref(localStorage.getItem('authToken'))
  const user = ref(null)
  const router = useRouter()


  function setAuthData(tokenData, userData) {
    localStorage.setItem('authToken', tokenData)
    token.value = tokenData
    user.value = userData
  }

  async function login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password })
    const { token, user } = response.data
    setAuthData(token, user)
    router.push('/Reviews') 
  }

  async function register(payload) {
    const response = await apiClient.post('/auth/register', payload)
    const { token, user } = response.data
    setAuthData(token, user)
    router.push('/Reviews') 
  }

  async function fetchUser() {
    if (!token.value) return 

    try {
      const response = await apiClient.get('/users/me')
      user.value = response.data
    } catch (error) {
      console.error('Error al cargar usuario, borrando token.', error)
      logout()
    }
  }

  function logout() {
    localStorage.removeItem('authToken')
    token.value = null
    user.value = null
    router.push('/login') 
  }

  async function uploadAvatar(file) {
    if (!token.value) throw new Error("No autenticado");

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await apiClient.put('/users/me/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });

      user.value = response.data;

    } catch (error) {
      console.error("Error al subir avatar:", error);
      throw error; 
    }
  }
  return { token, user, login, register, fetchUser, logout, uploadAvatar }
})