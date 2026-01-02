"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { userService } from "@/lib/services"
import { DialogDescription } from "@radix-ui/react-dialog"

interface EditUserDialogProps {
  userId: number
  currentRole: "USER" | "ADMIN"
  token: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: (updatedRole: "USER" | "ADMIN") => void
}

export function EditUserDialog({ userId, currentRole, token, open, onOpenChange, onSaved }: EditUserDialogProps) {
  const [role, setRole] = useState<typeof currentRole>(currentRole)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  React.useEffect(() => {
    if (open) setRole(currentRole)
  }, [open, currentRole])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const updated = await userService.updateUser({ id: userId, utilisateur: { role }, token })
      toast({ title: "Utilisateur mis à jour", description: `Le rôle a été changé en ${updated.role}.` })
      onSaved(updated.role)
      onOpenChange(false)
    } catch (e: any) {
      toast({ title: "Erreur", description: e?.message || "Impossible de mettre à jour l'utilisateur.", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Modifier le rôle</DialogTitle>
          <DialogDescription>Changez le rôle de l'utilisateur.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-6">
          <div className="grid gap-2">
            <Label>Rôle</Label>
            <Select value={role} onValueChange={(v: string) => setRole(v as "USER" | "ADMIN") }>
              <SelectTrigger className="w-full mt-4">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">USER</SelectItem>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button className="w-full" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
