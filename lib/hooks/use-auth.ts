"use client"

import { create } from "zustand"
import { useEffect, useRef } from "react"

interface User {
  id: string
  username: string
  email: string
  bio?: string
  avatar?: string
  reputation: number
  createdAt?: string
}

interface AuthStore {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  hasInitialized: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  hasInitialized: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),
  setInitialized: (hasInitialized) => set({ hasInitialized }),
  login: async (email, password) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Login failed")
    }

    const data = await response.json()
    set({ user: data.user, isAuthenticated: true })
  },
  register: async (username, email, password) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Registration failed")
    }

    const data = await response.json()
    set({ user: data.user, isAuthenticated: true })
  },
  logout: async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    set({ user: null, isAuthenticated: false })
  },
  fetchUser: async () => {
    try {
      set({ isLoading: true })
      const response = await fetch("/api/auth/me")

      if (response.ok) {
        const data = await response.json()
        set({ user: data.user, isAuthenticated: true })
      } else {
        set({ user: null, isAuthenticated: false })
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false })
    } finally {
      set({ isLoading: false, hasInitialized: true })
    }
  },
}))

export function useAuth() {
  const store = useAuthStore()
  const hasFetched = useRef(false)

  useEffect(() => {
    if (!store.hasInitialized && !hasFetched.current) {
      hasFetched.current = true
      store.fetchUser()
    }
  }, [store.hasInitialized, store.fetchUser])

  return store
}
