"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth"

export function AuthGuard({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      if (!user && pathname !== "/login" && pathname !== "/register") {
        router.push("/login")
      } else if (user && adminOnly && user.role !== "ADMIN") {
        router.push("/dashboard")
      }
    }
  }, [user, mounted, pathname, router, adminOnly])

  if (!mounted) return null

  return <>{children}</>
}
