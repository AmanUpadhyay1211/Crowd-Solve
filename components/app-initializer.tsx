"use client"

import { useAppInitialization } from "@/lib/hooks/use-app-initialization"

export function AppInitializer() {
  useAppInitialization()
  return null // This component doesn't render anything
}
