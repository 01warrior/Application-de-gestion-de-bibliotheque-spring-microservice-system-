"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/contexts/auth-context"
import { bookService } from "@/lib/services"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, BookIcon, User, Hash, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { BookFormDialog } from "@/components/book-form-dialog"
import { LoanFormDialog } from "@/components/loan-form-dialog"
import { BookDetailsDialog } from "@/components/book-details-dialog"

interface LivreResponse {
  id: number
  titre: string
  auteur: string
  categorie: string
  isbn: string
}

export default function BookCatalog() {
  const { user } = useAuth()
  const [books, setBooks] = useState<LivreResponse[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)
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

  useEffect(() => {
    if (user) fetchBooks()
  }, [user])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
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
          <h2 className="text-3xl font-bold tracking-tight">Catalogue des Livres</h2>
          <p className="text-muted-foreground">Explorez notre collection et trouvez votre prochaine lecture.</p>
        </div>
        {user?.role === "ADMIN" && <BookFormDialog onSuccess={() => fetchBooks()} />}
      </div>

      <Card className="border-none shadow-sm bg-muted/30">
        <CardContent className="px-6">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher par titre, auteur ou catégorie..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-lg border-muted bg-background py-6"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary/50" />
        </div>
      ) : filteredBooks.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBooks.map((book) => (
            <Card
              key={book.id}
              className="flex flex-col overflow-hidden transition-all hover:shadow-md border-border/50"
            >
              <CardHeader className="bg-primary/5 pb-3 pt-4 px-4">
                <div className="flex justify-between items-start mb-1.5">
                  <Badge variant="secondary" className="rounded-full font-medium text-xs">
                    {book.categorie}
                  </Badge>
                  <BookIcon className="size-4 text-primary/40" />
                </div>
                <CardTitle className="text-lg line-clamp-1 leading-tight">{book.titre}</CardTitle>
                <CardDescription className="flex items-center text-xs mt-1">
                  <User className="mr-1.5 size-3" />
                  {book.auteur}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 py-3 px-4">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Hash className="mr-2 size-3" />
                  <span className="font-mono text-xs">{book.isbn}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0 pb-3 px-4 gap-2">
                {user?.role === "ADMIN" ? (
                  <LoanFormDialog bookId={book.id} bookTitle={book.titre} onSuccess={() => fetchBooks()} />
                ) : (
                  <BookDetailsDialog bookId={book.id} title={book.titre} author={book.auteur} categorie={book.categorie} isbn={book.isbn} onSuccess={() => fetchBooks()} />
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted p-12 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
            <BookIcon className="size-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Aucun livre trouvé</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Essayez d'ajuster votre recherche pour trouver ce que vous cherchez.
          </p>
        </div>
      )}
    </div>
  )
}
