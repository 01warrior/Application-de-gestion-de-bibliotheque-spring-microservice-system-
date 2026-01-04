"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { loanService } from "@/lib/services"
import { API_BASE } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Handshake } from "lucide-react"
import { bookService } from "@/lib/services"

interface LoanFormDialogProps {
  bookId: number
  bookTitle: string
  onSuccess?: () => void
}

export function LoanFormDialog({ bookId, bookTitle, onSuccess }: LoanFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [utilisateurId, setUtilisateurId] = useState("")
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)

  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    let mounted = true
    const fetchAvailability = async () => {
      try {
        // Log start and token presence
        // eslint-disable-next-line no-console
        console.log('fetchAvailability start', { bookId, hasToken: !!user?.token })
        const available = await bookService.isBookAvailable(bookId, user?.token)
        // eslint-disable-next-line no-console
        console.log('availability for book', bookId, available)
        if (mounted) setIsAvailable(available)
      } catch (e) {
        if (mounted) {
          setIsAvailable(false)
          toast({ title: "Erreur", description: "Impossible de vérifier la disponibilité du livre.", variant: "destructive" })
        }
      }
    }

    if (open) fetchAvailability()
    else setIsAvailable(null)

    return () => {
      mounted = false
    }
  }, [open, bookId, user?.token, toast])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!user?.token) {
      toast({ title: "Erreur", description: "Utilisateur non authentifié.", variant: "destructive" })
      setIsLoading(false)
      return
    }

    try {
      await loanService.createLoan({ loan: { utilisateurId: Number.parseInt(utilisateurId), livreId: bookId }, token: user.token })

      toast({
        title: "Emprunt créé",
        description: `Le livre "${bookTitle}" a été prêté avec succès.`,
      })
      // Mark unavailable locally to avoid immediate re-submit
      setIsAvailable(false)
      setOpen(false)
      setUtilisateurId("")
      onSuccess?.()
    } catch (error: any) {
      const msg = error?.message || "Impossible de créer l'emprunt. Vérifiez l'ID de l'utilisateur."
      if (msg.includes("404")) {
        toast({ title: "Erreur", description: "Service Emprunts indisponible (404). Vérifiez que le service est démarré.", variant: "destructive" })
      } else if (msg.toLowerCase().includes("utilisateur")) {
        toast({ title: "Erreur", description: "Utilisateur introuvable. ID invalide.", variant: "destructive" })
      } else if (msg.toLowerCase().includes("livre")) {
        toast({ title: "Erreur", description: "Livre introuvable ou indisponible.", variant: "destructive" })
      } else {
        toast({ title: "Erreur", description: msg, variant: "destructive" })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full rounded-lg text-xs font-bold uppercase tracking-wider h-8">Enregistrer Prêt</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
              <Handshake className="size-6 text-primary" />
            </div>
            <DialogTitle className="text-center text-xl">Nouvel Emprunt</DialogTitle>
            <DialogDescription className="text-center">
              Enregistrez le prêt de <strong>{bookTitle}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="grid gap-2">
              <Label htmlFor="userId">ID de l'Utilisateur</Label>
              <Input
                id="userId"
                type="number"
                placeholder="Entrez l'ID numérique"
                value={utilisateurId}
                onChange={(e) => setUtilisateurId(e.target.value)}
                required
                className="rounded-lg"
              />
            </div>
          </div>
          <DialogFooter>
            <div className="w-full flex flex-col items-stretch">
              <Button type="submit" className="w-full rounded-lg" disabled={isLoading || isAvailable !== true}>
                {isLoading ? "Traitement..." : "Confirmer le prêt"}
              </Button>
              {isAvailable === false && (
                <div className="text-sm text-destructive mt-2 self-start">Ce livre est actuellement indisponible.</div>
              )}
              {isAvailable === null && (
                <div className="text-sm text-muted-foreground mt-2 self-start flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin inline-block" />
                  Vérification...
                </div>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
