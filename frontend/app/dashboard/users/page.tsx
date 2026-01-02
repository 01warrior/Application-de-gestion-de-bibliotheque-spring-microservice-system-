"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { userService } from "@/lib/services"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Mail, Phone, MapPin, Calendar, Edit3, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { EditUserDialog } from "@/components/edit-user-dialog"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

interface UtilisateurResponse {
  id: number
  nom: string
  email: string
  adresse: string
  telephone: string
  role: "USER" | "ADMIN"
  dateInscription: string
}

export default function UsersManagement() {
  const { user } = useAuth()
  const [users, setUsers] = useState<UtilisateurResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<UtilisateurResponse | null>(null)
  const [editingRole, setEditingRole] = useState<"USER" | "ADMIN">("USER")
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Deletion dialog state
  const [deletingUser, setDeletingUser] = useState<UtilisateurResponse | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Handler when a user's role is updated from the dialog
  const handleUserUpdated = (userId: number, updatedRole: "USER" | "ADMIN") => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: updatedRole } : u)))
    toast({ title: "Utilisateur mis à jour", description: "Le rôle a été mis à jour." })
  }

  const handleConfirmDelete = async () => {
    if (!deletingUser) return
    if (!user?.token) {
      toast({ title: "Erreur", description: "Non authentifié", variant: "destructive" })
      setDeletingUser(null)
      return
    }

    // Prevent self-deletion
    if (deletingUser.id === user.id) {
      toast({ title: "Erreur", description: "Vous ne pouvez pas supprimer votre propre compte.", variant: "destructive" })
      setDeletingUser(null)
      return
    }

    setIsDeleting(true)
    try {
      await userService.deleteUser({ id: deletingUser.id, token: user.token })
      setUsers((prev) => prev.filter((x) => x.id !== deletingUser.id))
      toast({ title: "Utilisateur supprimé", description: `${deletingUser.nom} a été supprimé.` })
      setDeletingUser(null)
    } catch (e: any) {
      toast({ title: "Erreur", description: e?.message || "Impossible de supprimer l'utilisateur.", variant: "destructive" })
    } finally {
      setIsDeleting(false)
    }
  }

  useEffect(() => {
    const fetchUsers = async () => {
      if (user?.role !== "ADMIN") return
      try {
        const data = await userService.getAllUsers(user.token)
        setUsers(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les utilisateurs",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [user, toast])

  if (user?.role !== "ADMIN") {
    return <div className="p-8 text-center">Accès réservé aux administrateurs.</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Gestion des Utilisateurs</h2>
        <p className="text-muted-foreground">Consultez et gérez les membres de la bibliothèque.</p>
      </div>

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <CardTitle>Liste des Membres</CardTitle>
          <CardDescription>
            {users.length} utilisateur{users.length > 1 ? "s" : ""} enregistré{users.length > 1 ? "s" : ""}
          </CardDescription>
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
                  <TableHead className="w-[250px]">Utilisateur</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead className="text-right">Inscription</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id} className="hover:bg-muted/5 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                          {u.nom.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{u.nom}</span>
                          <span className="text-xs text-muted-foreground">ID: #{u.id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Mail className="mr-1.5 size-3" />
                          {u.email}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Phone className="mr-1.5 size-3" />
                          {u.telephone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <div className="flex items-start text-xs text-muted-foreground">
                        <MapPin className="mr-1.5 mt-0.5 size-3 shrink-0" />
                        <span className="line-clamp-2">{u.adresse}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={u.role === "ADMIN" ? "default" : "secondary"}
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                      >
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end text-xs text-muted-foreground">
                        <Calendar className="mr-1.5 size-3" />
                        {format(new Date(u.dateInscription), "dd MMM yyyy", { locale: fr })}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Modifier le rôle"
                          onClick={() => { setEditingUser(u); setEditingRole(u.role) }}
                        >
                          <Edit3 className="size-4 text-primary" />
                        </Button>
                        {editingUser && editingUser.id === u.id && (
                          <EditUserDialog
                            userId={editingUser.id}
                            currentRole={editingRole}
                            token={user!.token}
                            open={true}
                            onOpenChange={(val) => { if (!val) setEditingUser(null) }}
                            onSaved={(updatedRole) => handleUserUpdated(editingUser.id, updatedRole)}
                          />
                        )}
                        <Button
                          variant="destructive"
                          size="icon"
                          title="Supprimer l'utilisateur"
                          onClick={() => setDeletingUser(u)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>

        <Dialog open={!!deletingUser} onOpenChange={(val) => { if (!val) setDeletingUser(null) }}>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogDescription>
                Voulez-vous vraiment supprimer <strong>{deletingUser?.nom}</strong> (ID: {deletingUser?.id}) ? Cette action est irréversible.
              </DialogDescription>
              {deletingUser?.id === user?.id && (
                <p className="mt-2 text-sm text-destructive">Vous ne pouvez pas supprimer votre propre compte.</p>
              )}
            </DialogHeader>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setDeletingUser(null)} disabled={isDeleting}>Annuler</Button>
              <Button variant="destructive" className="ml-2" onClick={handleConfirmDelete} disabled={isDeleting || deletingUser?.id === user?.id}>
                {isDeleting ? "Suppression..." : "Confirmer la suppression"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  )
}
