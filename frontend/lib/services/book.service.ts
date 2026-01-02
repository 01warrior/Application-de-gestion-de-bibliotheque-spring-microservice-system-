import { apiRequest } from "../api"

export interface LivreResponse {
  id: number
  titre: string
  auteur: string
  categorie: string
  isbn: string
  dateCreation: string
  dateModification: string
}

export interface LivreRequest {
  titre: string
  auteur: string
  categorie: string
  isbn: string
}

export interface CreateLivreParams {
  livre: LivreRequest
  token: string
}

export interface UpdateLivreParams {
  id: number
  livre: LivreRequest
  token: string
}

export interface DeleteLivreParams {
  id: number
  token: string
}

export interface SearchBooksParams {
  titre?: string
  auteur?: string
  categorie?: string
  token: string
}

class BookService {
  // Récupérer tous les livres
  async getAllBooks(token: string): Promise<LivreResponse[]> {
    return apiRequest<LivreResponse[]>("/api/books", token)
  }

  // Récupérer un livre par ID
  async getBookById(id: number, token: string): Promise<LivreResponse> {
    return apiRequest<LivreResponse>(`/api/books/${id}`, token)
  }

  // Créer un livre (ADMIN uniquement)
  async createBook({ livre, token }: CreateLivreParams): Promise<LivreResponse> {
    return apiRequest<LivreResponse>("/api/books", token, {
      method: "POST",
      body: JSON.stringify(livre),
    })
  }

  // Mettre à jour un livre (ADMIN uniquement)
  async updateBook({ id, livre, token }: UpdateLivreParams): Promise<LivreResponse> {
    return apiRequest<LivreResponse>(`/api/books/${id}`, token, {
      method: "PUT",
      body: JSON.stringify(livre),
    })
  }

  // Supprimer un livre (ADMIN uniquement)
  async deleteBook({ id, token }: DeleteLivreParams): Promise<void> {
    return apiRequest<void>(`/api/books/${id}`, token, {
      method: "DELETE",
    })
  }

  // Rechercher des livres
  async searchBooks({ titre, auteur, categorie, token }: SearchBooksParams): Promise<LivreResponse[]> {
    const params = new URLSearchParams()
    if (titre) params.append("titre", titre)
    if (auteur) params.append("auteur", auteur)
    if (categorie) params.append("categorie", categorie)

    const queryString = params.toString()
    const endpoint = queryString ? `/api/books/search?${queryString}` : "/api/books"

    return apiRequest<LivreResponse[]>(endpoint, token)
  }
}

export const bookService = new BookService()
