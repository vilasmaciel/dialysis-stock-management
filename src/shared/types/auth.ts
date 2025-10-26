export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  createdAt: string
}

export interface AuthSession {
  user: User
  accessToken: string
  expiresAt: number
}
