import { request, jsonBody } from './http'
import type { DbUser, Role } from '../types'

export const usersApi = {
  findByEmail: async (email: string) => {
    const rows = await request<DbUser[]>(`/users?email=${encodeURIComponent(email)}`)
    return rows[0]
  },
  create: (input: { email: string; password: string; fullName: string; role: Role }) =>
    request<DbUser>('/users', {
      method: 'POST',
      ...jsonBody({ ...input, createdAt: new Date().toISOString() }),
    }),
}
