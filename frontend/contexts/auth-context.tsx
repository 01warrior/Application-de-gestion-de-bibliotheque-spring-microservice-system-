"use client"

import type React from "react"
import { useAuth } from "@/lib/auth"

// Proxy useAuth so existing imports work
export { useAuth }

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
