"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Notification {
  _id: string
  type: 'vote' | 'solution_accepted' | 'new_solution' | 'problem_solved'
  message: string
  relatedId: string
  isRead: boolean
  createdAt: string
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
  autoRefresh: boolean
  itemsPerPage: number
}

interface AppStore {
  // State
  notifications: Notification[]
  settings: AppSettings
  isOnline: boolean
  lastActivity: number | null
  
  // Actions
  setNotifications: (notifications: Notification[]) => void
  addNotification: (notification: Notification) => void
  markNotificationAsRead: (notificationId: string) => void
  markAllNotificationsAsRead: () => void
  removeNotification: (notificationId: string) => void
  clearNotifications: () => void
  
  updateSettings: (settings: Partial<AppSettings>) => void
  setOnlineStatus: (isOnline: boolean) => void
  updateLastActivity: () => void
  
  // Computed
  unreadNotificationsCount: number
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      notifications: [],
      settings: {
        theme: 'system',
        notifications: true,
        autoRefresh: true,
        itemsPerPage: 10
      },
      isOnline: true,
      lastActivity: null,

      // Actions
      setNotifications: (notifications) => set({ notifications }),
      
      addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications]
      })),
      
      markNotificationAsRead: (notificationId) => set((state) => ({
        notifications: state.notifications.map(notification =>
          notification._id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      })),
      
      markAllNotificationsAsRead: () => set((state) => ({
        notifications: state.notifications.map(notification => ({
          ...notification,
          isRead: true
        }))
      })),
      
      removeNotification: (notificationId) => set((state) => ({
        notifications: state.notifications.filter(notification => 
          notification._id !== notificationId
        )
      })),
      
      clearNotifications: () => set({ notifications: [] }),
      
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
      
      setOnlineStatus: (isOnline) => set({ isOnline }),
      
      updateLastActivity: () => set({ lastActivity: Date.now() }),

      // Computed getters
      get unreadNotificationsCount() {
        return get().notifications.filter(notification => !notification.isRead).length
      }
    }),
    {
      name: 'app-store',
      partialize: (state) => ({
        settings: state.settings,
        notifications: state.notifications
      })
    }
  )
)
