"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

// Notification system - currently not implemented
// export interface Notification {
//   _id: string
//   type: 'vote' | 'solution_accepted' | 'new_solution' | 'problem_solved'
//   message: string
//   relatedId: string
//   isRead: boolean
//   createdAt: string
// }

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
  autoRefresh: boolean
  itemsPerPage: number
}

interface AppStore {
  // State
  settings: AppSettings
  isOnline: boolean
  lastActivity: number | null
  
  // Actions
  updateSettings: (settings: Partial<AppSettings>) => void
  setOnlineStatus: (isOnline: boolean) => void
  updateLastActivity: () => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      settings: {
        theme: 'system',
        notifications: true,
        autoRefresh: true,
        itemsPerPage: 10
      },
      isOnline: true,
      lastActivity: null,

      // Actions
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
      
      setOnlineStatus: (isOnline) => set({ isOnline }),
      
      updateLastActivity: () => set({ lastActivity: Date.now() })
    }),
    {
      name: 'app-store',
      partialize: (state) => ({
        settings: state.settings
      })
    }
  )
)
