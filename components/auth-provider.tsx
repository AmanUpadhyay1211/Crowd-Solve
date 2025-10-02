"use client"

import type React from "react"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Auth initialization is now handled in the useAuth hook
  return <>{children}</>
}
