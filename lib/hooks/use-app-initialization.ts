"use client"

import { useEffect } from "react"
import { useAuth } from "./use-auth"
import { useProblemsStore } from "@/lib/stores/problems-store"
import { useAppStore } from "@/lib/stores/app-store"

export function useAppInitialization() {
  const { isAuthenticated, hasInitialized } = useAuth()
  const { fetchProblems } = useProblemsStore()
  const { updateLastActivity } = useAppStore()

  // Initialize app data when user is authenticated
  useEffect(() => {
    if (hasInitialized && isAuthenticated) {
      // Fetch initial data
      fetchProblems()
      
      // Update last activity
      updateLastActivity()
    }
  }, [hasInitialized, isAuthenticated, fetchProblems, updateLastActivity])

  // Track user activity
  useEffect(() => {
    const handleActivity = () => {
      updateLastActivity()
    }

    // Track various user activities
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
    }
  }, [updateLastActivity])

  return {
    isInitialized: hasInitialized,
    isAuthenticated
  }
}
