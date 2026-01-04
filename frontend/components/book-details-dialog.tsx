"use client"

import React, { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { loanService } from "@/lib/services"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { bookService } from "@/lib/services"

interface BookDetailsDialogProps {
  bookId: number
  title: string
  author: string
  categorie?: string
  isbn?: string
  onSuccess?: () => void
}

export function BookDetailsDialog({ bookId, title, author, categorie, isbn, onSuccess }: BookDetailsDialogProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)

  // Fetch availability when dialog opens
  React.useEffect(() => {
    let mounted = true
    const fetchAvailability = async () => {
      try {
        // eslint-disable-next-line no-console
        console.log("fetchAvailability start", { bookId, hasToken: !!user?.token })
        const available = await bookService.isBookAvailable(bookId, user?.token)
        // eslint-disable-next-line no-console
        console.log("availability for book", bookId, available)
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

  const handleBorrow = async () => {
    if (!user?.token || !user?.id) {
      toast({ title: "Erreur", description: "Vous devez être connecté pour emprunter.", variant: "destructive" })
      return
    }

    setIsLoading(true)
    try {
      await loanService.createLoan({ loan: { utilisateurId: user.id, livreId: bookId }, token: user.token })
      toast({ title: "Emprunt enregistré", description: `Vous avez emprunté "${title}".` })
      onSuccess?.()
      // Mark unavailable locally immediately to avoid a fast double-click race
      setIsAvailable(false)
      setOpen(false)
    } catch (e: any) {
      const msg = e?.message || "Impossible d'enregistrer l'emprunt."
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
        <Button variant="outline" className="w-full rounded-lg text-xs font-semibold uppercase tracking-wider h-8 bg-transparent">
          Détails
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="mb-2">Par {author}</DialogDescription>
          <div className="text-sm text-muted-foreground">
            {categorie && <div>Categorie: {categorie}</div>}
            {isbn && <div>ISBN: {isbn}</div>}
          </div>
        </DialogHeader>
        <div className="mt-4">
          {user?.role === "USER" ? (
            <>
              <Button className="w-full" onClick={handleBorrow} disabled={isLoading || isAvailable !== true}>
                {isLoading ? "Traitement..." : "Emprunter"}
              </Button>
              {isAvailable === false && (
                <div className="text-sm text-destructive mt-2">Ce livre est actuellement indisponible.</div>
              )}
              {isAvailable === null && (
                <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin inline-block" />
                  Vérification...
                </div>
              )}
            </>
          ) : (
            <div className="text-sm text-muted-foreground">Connectez-vous en tant qu'utilisateur pour emprunter.</div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" className="w-full">
              Fermer
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
