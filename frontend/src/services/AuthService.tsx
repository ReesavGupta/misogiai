import { api } from '../lib/api'
import type { User } from '../types'

export const authService = {
  async signup(name: string, email: string, password: string): Promise<User> {
    const response = await api.post('/auth/signup', {
      name,
      email,
      password,
    })
    return response.data.user
  },

  async login(email: string, password: string): Promise<User> {
    const response = await api.post('/auth/login', {
      email,
      password,
    })
    return response.data.user
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get('/users/me')
      return response.data
    } catch (error) {
      throw new Error('Not authenticated')
    }
  },

  async refreshToken(): Promise<void> {
    await api.post('/auth/refresh-token')
  },
}
