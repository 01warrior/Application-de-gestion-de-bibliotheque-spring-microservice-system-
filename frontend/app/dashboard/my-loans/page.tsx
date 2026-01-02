"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { loanService } from "@/lib/services"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, BookOpen, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface LivreInfo {
  id: number
  titre: string
  auteur: string
}

interface EmpruntResponse {
  id: number
  utilisateurId: number
  livreId: number
  dateEmprunt: string
  dateRetourPrevue: string
  dateRetourEffective?: string
  statut: "ACTIF" | "RETOURNE" | "EN_RETARD"
  livre?: LivreInfo
}

export default function MyLoansPage() {
  const { user } = useAuth()
  const [loans, setLoans] = useState<EmpruntResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchMyLoans = async () => {
    if (!user?.id) return
    if (!user?.token) {
      toast({ title: "Erreur", description: "Utilisateur non authentifié.", variant: "destructive" })
      setIsLoading(false)
      return
    }

    try {
      const data = await loanService.getUserLoans({ userId: user.id, token: user.token })
      setLoans(data)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger vos emprunts",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMyLoans()
  }, [user])

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case "ACTIF":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "RETOURNE":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "EN_RETARD":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "ACTIF":
        return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">En cours</Badge>
      case "RETOURNE":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Retourné</Badge>
      case "EN_RETARD":
        return <Badge variant="destructive" className="bg-red-100 text-red-800">En retard</Badge>
      default:
        return <Badge>{statut}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Chargement de vos emprunts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mes Emprunts</h1>
        <p className="text-muted-foreground mt-2">
          Consultez l'historique de vos emprunts et les retours prévus
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Historique des emprunts
          </CardTitle>
          <CardDescription>
            {loans.length} emprunt{loans.length !== 1 ? "s" : ""} au total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground text-lg font-medium">Aucun emprunt</p>
              <p className="text-sm text-muted-foreground/70">
                Vous n'avez pas encore emprunté de livres
              </p>
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Titre</TableHead>
                    <TableHead>Auteur</TableHead>
                    <TableHead>Date d'emprunt</TableHead>
                    <TableHead>Date de retour prévue</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loans.map((loan) => (
                    <TableRow key={loan.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {loan.livre?.titre || "Livre supprimé"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {loan.livre?.auteur || "N/A"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(loan.dateEmprunt), "dd MMM yyyy", { locale: fr })}
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(loan.dateRetourPrevue), "dd MMM yyyy", { locale: fr })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(loan.statut)}
                          {getStatusBadge(loan.statut)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
