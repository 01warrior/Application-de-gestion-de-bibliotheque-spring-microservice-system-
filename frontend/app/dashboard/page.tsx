"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/contexts/auth-context"
import { bookService, loanService } from "@/lib/services"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, BookIcon, User, Hash, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { BookFormDialog } from "@/components/book-form-dialog"
import { LoanFormDialog } from "@/components/loan-form-dialog"
import { BookDetailsDialog } from "@/components/book-details-dialog"
import DashboardWidgets from "@/components/dashboard-widgets"

interface LivreResponse {
  id: number
  titre: string
  auteur: string
  categorie: string
  isbn: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [books, setBooks] = useState<LivreResponse[]>([])
  const [loans, setLoans] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDashboardLoading, setIsDashboardLoading] = useState(true)
  const { toast } = useToast()

  const fetchBooks = async () => {
    setIsLoading(true)
    if (!user?.token) {
      toast({ title: "Erreur", description: "Utilisateur non authentifié.", variant: "destructive" })
      setIsLoading(false)
      return
    }

    try {
      const data = await bookService.getAllBooks(user.token)
      setBooks(data)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger le catalogue",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDashboardData = async () => {
    setIsDashboardLoading(true)
    if (!user?.token) return

    try {
      let fetchedLoans: any[] = []
      if (user.role === "ADMIN") {
        fetchedLoans = await loanService.getAllLoans(user.token)
      } else {
        fetchedLoans = await loanService.getUserLoans({ userId: user.id, token: user.token })
      }

      setLoans(fetchedLoans || [])
    } catch (err) {
      toast({ title: "Erreur", description: "Impossible de charger les données du dashboard", variant: "destructive" })
    } finally {
      setIsDashboardLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchBooks()
      fetchDashboardData()
    }
  }, [user])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is done client-side by filtering `books` via `filteredBooks`.
  }

  const filteredBooks = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return books
    return books.filter(
      (b) =>
        b.titre.toLowerCase().includes(q) ||
        b.auteur.toLowerCase().includes(q) ||
        (b.categorie || "").toLowerCase().includes(q),
    )
  }, [books, search])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2>
          <p className="text-muted-foreground">Vue d'ensemble des activités: prêts, livres et retards.</p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/dashboard/catalogue">
            <Button variant="ghost">Voir le catalogue</Button>
          </a>
        </div>
      </div>

      <DashboardWidgets books={books} loans={loans} isLoading={isDashboardLoading} />

    </div>
  )
}
