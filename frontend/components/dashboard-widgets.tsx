"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface LivreResponse {
  id: number
  titre: string
  auteur: string
  categorie: string
  isbn: string
}

interface Props {
  books: LivreResponse[]
  loans: any[]
  isLoading: boolean
}

export default function DashboardWidgets({ books, loans, isLoading }: Props) {
  // Prepare dashboard aggregates
  const totalBooks = books.length
  const activeLoansCount = loans.filter((l) => l.statut === "ACTIF").length
  const overdueCount = loans.filter((l) => l.statut === "EN_RETARD").length

  // Most borrowed books computation
  const mostBorrowed = (() => {
    const counts = new Map<number, number>()
    loans.forEach((l) => counts.set(l.livreId, (counts.get(l.livreId) || 0) + 1))
    const arr = Array.from(counts.entries()).map(([livreId, count]) => {
      const b = books.find((bb) => bb.id === livreId)
      return { titre: b ? b.titre : `Livre ${livreId}`, count }
    })
    return arr.sort((a, b) => b.count - a.count).slice(0, 6)
  })()

  // Loans per day for last 7 days
  const loansByDay = (() => {
    const days: Record<string, number> = {}
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      days[key] = 0
    }
    loans.forEach((l) => {
      const day = l.dateEmprunt ? l.dateEmprunt.slice(0, 10) : null
      if (day && day in days) days[day] = days[day] + 1
    })
    return Object.entries(days).map(([date, count]) => ({ date, count }))
  })()

  return (
    <>
      {/* Metrics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <CardTitle>Total des livres</CardTitle>
          <CardContent>
            <div className="text-2xl font-bold">{totalBooks}</div>
            <CardDescription className="mt-2">Nombre total de livres dans la base</CardDescription>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardTitle>Emprunts actifs</CardTitle>
          <CardContent>
            <div className="text-2xl font-bold">{activeLoansCount}</div>
            <CardDescription className="mt-2">Emprunts en cours</CardDescription>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardTitle>Emprunts en retard</CardTitle>
          <CardContent>
            <div className="text-2xl font-bold">{overdueCount}</div>
            <CardDescription className="mt-2">Emprunts en retard</CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2 mt-4">
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Prêts sur 7 jours</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 200 }}>
            {isLoading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="size-8 animate-spin text-primary/50" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={loansByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardHeader>
            <CardTitle>Livres les plus empruntés</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 200 }}>
            {isLoading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="size-8 animate-spin text-primary/50" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={mostBorrowed} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="titre" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
