"use client"

import { useEffect } from "react"
import { useAuth } from "./use-auth"
import { useAppStore } from "@/lib/stores/app-store"

export function useAppInitialization() {
  const { isAuthenticated, hasInitialized } = useAuth()
  const { updateLastActivity } = useAppStore()

  // Initialize app data when user is authenticated
  useEffect(() => {
    if (hasInitialized && isAuthenticated) {
      // Update last activity on login
      updateLastActivity()
    }
  }, [hasInitialized, isAuthenticated, updateLastActivity])

  // Track meaningful user activity (only on specific actions)
  useEffect(() => {
    const handleMeaningfulActivity = () => {
      updateLastActivity()
    }

    // Only track meaningful interactions, not every mouse move
    const events = ['click', 'keydown', 'submit']
    
    events.forEach(event => {
      document.addEventListener(event, handleMeaningfulActivity, true)
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleMeaningfulActivity, true)
      })
    }
  }, [updateLastActivity])

  return {
    isInitialized: hasInitialized,
    isAuthenticated
  }
}
