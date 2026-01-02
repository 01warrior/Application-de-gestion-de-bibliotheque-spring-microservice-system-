import { apiRequest } from "../api"

export interface EmpruntResponse {
  id: number
  utilisateurId: number
  livreId: number
  dateEmprunt: string
  dateRetourPrevue: string
  dateRetourEffective?: string
  statut: "ACTIF" | "RETOURNE" | "EN_RETARD"
  dateCreation: string
}

export interface EmpruntRequest {
  utilisateurId: number
  livreId: number
}

export interface CreateLoanParams {
  loan: EmpruntRequest
  token: string
}

export interface ReturnLoanParams {
  id: number
  token: string
}

export interface GetUserLoansParams {
  userId: number
  token: string
}

export interface GetBookLoansParams {
  bookId: number
  token: string
}

class LoanService {
  // Récupérer tous les emprunts (ADMIN uniquement)
  async getAllLoans(token: string): Promise<EmpruntResponse[]> {
    return apiRequest<EmpruntResponse[]>("/api/loans", token)
  }

  // Récupérer un emprunt par ID
  async getLoanById(id: number, token: string): Promise<EmpruntResponse> {
    return apiRequest<EmpruntResponse>(`/api/loans/${id}`, token)
  }

  // Créer un emprunt (ADMIN uniquement)
  async createLoan({ loan, token }: CreateLoanParams): Promise<EmpruntResponse> {
    return apiRequest<EmpruntResponse>("/api/loans", token, {
      method: "POST",
      body: JSON.stringify(loan),
    })
  }

  // Marquer un emprunt comme retourné (ADMIN uniquement)
  async returnLoan({ id, token }: ReturnLoanParams): Promise<EmpruntResponse> {
    return apiRequest<EmpruntResponse>(`/api/loans/${id}/return`, token, {
      method: "PUT",
    })
  }

  // Récupérer les emprunts d'un utilisateur
  async getUserLoans({ userId, token }: GetUserLoansParams): Promise<EmpruntResponse[]> {
    return apiRequest<EmpruntResponse[]>(`/api/loans/user/${userId}`, token)
  }

  // Récupérer les emprunts d'un livre
  async getBookLoans({ bookId, token }: GetBookLoansParams): Promise<EmpruntResponse[]> {
    return apiRequest<EmpruntResponse[]>(`/api/loans/book/${bookId}`, token)
  }

  // Récupérer les emprunts en retard (ADMIN uniquement)
  async getOverdueLoans(token: string): Promise<EmpruntResponse[]> {
    return apiRequest<EmpruntResponse[]>("/api/loans/overdue", token)
  }
}

export const loanService = new LoanService()
