import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { usersApi } from '../api/users'
import { ApiError } from '../api/http'
import type { DbUser, User } from '../types'

const KEY = 'flower-session'

function load(): User | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

function toUser(row: DbUser): User {
  const { password: _password, ...user } = row
  return user
}

export const useSessionStore = defineStore('session', () => {
  const user = ref<User | null>(load())
  const isLoggedIn = computed(() => user.value !== null)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')

  function setUser(next: User | null) {
    user.value = next
    try {
      if (next) localStorage.setItem(KEY, JSON.stringify(next))
      else localStorage.removeItem(KEY)
    } catch {
      /* storage unavailable: the session just will not survive a reload */
    }
  }

  async function login(email: string, password: string) {
    const found = await usersApi.findByEmail(email.trim().toLowerCase())
    if (!found || found.password !== password) throw new ApiError(401, 'Wrong email or password.')
    setUser(toUser(found))
  }

  async function register(fullName: string, email: string, password: string) {
    const cleanEmail = email.trim().toLowerCase()
    if (await usersApi.findByEmail(cleanEmail)) {
      throw new ApiError(409, 'An account with this email already exists.')
    }
    const created = await usersApi.create({
      email: cleanEmail,
      password,
      fullName: fullName.trim(),
      role: 'CUSTOMER',
    })
    setUser(toUser(created))
  }

  function logout() {
    setUser(null)
  }

  return { user, isLoggedIn, isAdmin, login, register, logout }
})
