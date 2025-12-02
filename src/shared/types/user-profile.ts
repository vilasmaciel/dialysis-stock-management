export interface UserProfile {
  id: string
  userId: string
  fullName: string | null
  phone: string | null
  address: string | null
  createdAt: string
  updatedAt: string
}

export interface UserProfileInput {
  fullName: string
  phone: string
  address: string
}
