"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { loanService } from "@/lib/services"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, BookOpen, User, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

interface EmpruntResponse {
  id: number
  utilisateurId: number
  livreId: number
  dateEmprunt: string
  dateRetourPrevue: string
  dateRetourEffective?: string
  statut: "ACTIF" | "RETOURNE" | "EN_RETARD"
}

export default function LoansManagement() {
  const { user } = useAuth()
  const [loans, setLoans] = useState<EmpruntResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchLoans = async () => {
    if (user?.role !== "ADMIN") return
    if (!user?.token) {
      toast({ title: "Erreur", description: "Utilisateur non authentifié.", variant: "destructive" })
      setIsLoading(false)
      return
    }

    try {
      const data = await loanService.getAllLoans(user.token)
      setLoans(data)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les emprunts",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLoans()
  }, [user])

  const handleReturn = async (loanId: number) => {
    if (!user?.token) {
      toast({ title: "Erreur", description: "Utilisateur non authentifié.", variant: "destructive" })
      return
    }

    try {
      await loanService.returnLoan({ id: loanId, token: user.token })
      toast({
        title: "Livre retourné",
        description: "L'emprunt a été marqué comme retourné.",
      })
      fetchLoans()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de retourner le livre",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (statut: EmpruntResponse["statut"]) => {
    const variants = {
      ACTIF: { class: "bg-blue-500/10 text-blue-600 border-blue-200", icon: Clock },
      RETOURNE: { class: "bg-green-500/10 text-green-600 border-green-200", icon: CheckCircle2 },
      EN_RETARD: { class: "bg-red-500/10 text-red-600 border-red-200", icon: AlertCircle },
    }
    const config = variants[statut]
    const Icon = config.icon

    return (
      <Badge
        variant="outline"
        className={`rounded-full gap-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${config.class}`}
      >
        <Icon className="size-3" />
        {statut}
      </Badge>
    )
  }

  if (user?.role !== "ADMIN") {
    return <div className="p-8 text-center">Accès réservé aux administrateurs.</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Gestion des Emprunts</h2>
        <p className="text-muted-foreground">Surveillez les retours et gérez les prêts en cours.</p>
      </div>

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <CardTitle>Registre des Prêts</CardTitle>
          <CardDescription>Tous les emprunts enregistrés dans le système</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="size-8 animate-spin text-primary/50" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/20 hover:bg-muted/20">
                  <TableHead>ID</TableHead>
                  <TableHead>Détails</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans.map((loan) => (
                  <TableRow key={loan.id} className="hover:bg-muted/5 transition-colors">
                    <TableCell className="font-mono text-xs">#{loan.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center text-xs font-medium">
                          <User className="mr-1.5 size-3.5 text-muted-foreground" />
                          Utilisateur #{loan.utilisateurId}
                        </div>
                        <div className="flex items-center text-xs font-medium">
                          <BookOpen className="mr-1.5 size-3.5 text-muted-foreground" />
                          Livre #{loan.livreId}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center text-[10px] text-muted-foreground">
                          <span className="w-16 uppercase font-bold">Sortie:</span>
                          {format(new Date(loan.dateEmprunt), "dd/MM/yyyy")}
                        </div>
                        <div className="flex items-center text-[10px] text-muted-foreground">
                          <span className="w-16 uppercase font-bold text-primary/70">Prévu:</span>
                          {format(new Date(loan.dateRetourPrevue), "dd/MM/yyyy")}
                        </div>
                        {loan.dateRetourEffective && (
                          <div className="flex items-center text-[10px] text-green-600 font-medium">
                            <span className="w-16 uppercase font-bold">Retour:</span>
                            {format(new Date(loan.dateRetourEffective), "dd/MM/yyyy")}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(loan.statut)}</TableCell>
                    <TableCell className="text-right">
                      {loan.statut !== "RETOURNE" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReturn(loan.id)}
                          className="rounded-lg h-8 text-[10px] font-bold uppercase tracking-wider"
                        >
                          Marquer Retour
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
