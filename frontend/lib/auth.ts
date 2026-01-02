import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: number
  nom: string
  email: string
  role: "USER" | "ADMIN"
  token: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  setLoading: (loading: boolean) => void
  login: (user: User) => void
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setLoading: (loading) => set({ isLoading: loading }),
      login: (user) => set({ user, isLoading: false }),
      logout: () => set({ user: null }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        // called after rehydration — clear the loading flag
        if (state && state.setLoading) {
          state.setLoading(false)
        }
      },
    },
  ),
)
