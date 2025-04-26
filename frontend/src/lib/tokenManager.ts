let accessToken: string | null = null

export const tokenManager = {
  set(token: string) {
    accessToken = token
    localStorage.setItem('accessToken', token)
  },

  get(): string | null {
    if (accessToken) return accessToken
    return localStorage.getItem('accessToken')
  },

  clear() {
    accessToken = null
    localStorage.removeItem('accessToken')
  },
}
