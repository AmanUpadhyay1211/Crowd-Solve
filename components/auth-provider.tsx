"use client"

import type React from "react"

import { useAuth } from "@/lib/hooks/use-auth"
import { useEffect } from "react"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { fetchUser } = useAuth()

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return <>{children}</>
}
