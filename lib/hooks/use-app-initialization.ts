"use client"

import { useEffect } from "react"
import { useAuth } from "./use-auth"
import { useAppStore } from "@/lib/stores/app-store"
import { useProblemsStore } from "@/lib/stores/problems-store"

export function useAppInitialization() {
  const { isAuthenticated, hasInitialized } = useAuth()
  const { updateLastActivity } = useAppStore()
  const { fetchProblems } = useProblemsStore()

  // Initialize app data
  useEffect(() => {
    if (hasInitialized) {
      // Fetch problems for everyone (public content)
      fetchProblems()
      
      // Update last activity if authenticated
      if (isAuthenticated) {
        updateLastActivity()
      }
    }
  }, [hasInitialized, isAuthenticated]) // Only re-run when auth state changes

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
