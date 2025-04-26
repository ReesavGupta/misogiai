import axios from 'axios'
import { authService } from '../services/AuthService'
import { tokenManager } from './tokenManager'

function getAccessToken() {
  return localStorage.getItem('accessToken')
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8888/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Attach token before every request
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken() // read token from localStorage or auth context
    console.log(`Token from localStorage: ${token}`)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Handle token refresh if 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        await authService.refreshToken()
        return api(originalRequest)
      } catch (refreshError) {
        tokenManager.clear()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
