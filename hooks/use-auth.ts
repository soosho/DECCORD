"use client"

import { useAuth as useClerkAuth } from "@clerk/nextjs"

export function useAuth() {
  const { isLoaded, userId, sessionId } = useClerkAuth()
  
  return {
    isAuthenticated: isLoaded && !!userId,
    checkAuth: () => !!userId // For compatibility with existing code
  }
}