"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
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
import { Plus, BookPlus } from "lucide-react"

interface BookFormDialogProps {
  onSuccess: () => void
}

export function BookFormDialog({ onSuccess }: BookFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { user } = useAuth()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    titre: "",
    auteur: "",
    categorie: "",
    isbn: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      const response = await fetch(`${API_BASE}/api/books`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        // Try to parse validation errors from the backend
        const contentType = response.headers.get("Content-Type") || ""
        if (response.status === 400 && contentType.includes("application/json")) {
          const body = await response.json().catch(() => null)
          const validation = body?.validationErrors
          if (validation && Object.keys(validation).length > 0) {
            setErrors(validation)
            const messages = Object.values(validation).join(". ")
            toast({ title: "Erreur de validation", description: messages, variant: "destructive" })
            return
          }
        }

        throw new Error()
      }

      toast({
        title: "Livre ajouté",
        description: "Le livre a été ajouté avec succès au catalogue.",
      })
      setOpen(false)
      setFormData({ titre: "", auteur: "", categorie: "", isbn: "" })
      setErrors({})
      onSuccess()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le livre.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (val) setErrors({}); }}>
      <DialogTrigger asChild>
        <Button className="rounded-lg shadow-sm">
          <Plus className="mr-2 size-4" />
          Ajouter un Livre
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
              <BookPlus className="size-6 text-primary" />
            </div>
            <DialogTitle className="text-center text-xl">Nouveau Livre</DialogTitle>
            <DialogDescription className="text-center">
              Remplissez les détails pour ajouter un nouveau livre au catalogue.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="grid gap-2">
              <Label htmlFor="titre">Titre</Label>
              <Input
                id="titre"
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                required
                maxLength={255}
                className="rounded-lg"
              />
              {errors.titre && <p className="text-sm text-destructive mt-1">{errors.titre}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="auteur">Auteur</Label>
              <Input
                id="auteur"
                value={formData.auteur}
                onChange={(e) => setFormData({ ...formData, auteur: e.target.value })}
                required
                maxLength={255}
                className="rounded-lg"
              />
              {errors.auteur && <p className="text-sm text-destructive mt-1">{errors.auteur}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="categorie">Catégorie</Label>
              <Input
                id="categorie"
                value={formData.categorie}
                onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                required
                maxLength={100}
                className="rounded-lg"
              />
              {errors.categorie && <p className="text-sm text-destructive mt-1">{errors.categorie}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                required
                placeholder="ex: 978-3-16-148410-0"
                className="rounded-lg font-mono text-sm"
              />
              {errors.isbn && <p className="text-sm text-destructive mt-1">{errors.isbn}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full rounded-lg" disabled={isLoading}>
              {isLoading ? "Ajout en cours..." : "Ajouter le livre"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
