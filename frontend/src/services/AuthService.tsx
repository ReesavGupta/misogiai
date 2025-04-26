import { tokenManager } from '@/lib/tokenManager'
import { api } from '../lib/api'
import type { User } from '../types'

export const authService = {
  async signup(name: string, email: string, password: string): Promise<User> {
    const response = await api.post('/auth/signup', { name, email, password })
    const { accessToken, user } = response.data.data
    tokenManager.set(accessToken)
    return user
  },

  async login(email: string, password: string): Promise<User> {
    const response = await api.post('/auth/login', { email, password })
    const { accessToken, user } = response.data.data
    tokenManager.set(accessToken)
    return user
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
    tokenManager.clear()
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/users/me')
    return response.data
  },

  async refreshToken(): Promise<void> {
    const response = await api.post('/auth/refresh-token')
    const { accessToken } = response.data.data
    tokenManager.set(accessToken)
  },
}
