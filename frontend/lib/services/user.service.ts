import { apiRequest } from "../api"

export interface UtilisateurResponse {
  id: number
  nom: string
  email: string
  adresse: string
  telephone: string
  role: "USER" | "ADMIN"
  dateInscription: string
}

export interface RegisterRequest {
  nom: string
  email: string
  adresse: string
  telephone: string
  motDePasse: string
}

export interface LoginRequest {
  email: string
  motDePasse: string
}

export interface AuthResponse {
  token: string
  type: "Bearer"
  userId: number
  email: string
  nom: string
  role: "USER" | "ADMIN"
}

export interface UpdateUserParams {
  id: number
  utilisateur: Partial<UtilisateurResponse>
  token: string
}

export interface DeleteUserParams {
  id: number
  token: string
}

class UserService {
  // S'inscrire
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/api/users/register", undefined, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Se connecter
  async login(data: LoginRequest): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/api/users/login", undefined, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Récupérer tous les utilisateurs (ADMIN uniquement)
  async getAllUsers(token: string): Promise<UtilisateurResponse[]> {
    return apiRequest<UtilisateurResponse[]>("/api/users", token)
  }

  // Récupérer un utilisateur par ID (ADMIN uniquement)
  async getUserById(id: number, token: string): Promise<UtilisateurResponse> {
    return apiRequest<UtilisateurResponse>(`/api/users/${id}`, token)
  }

  // Mettre à jour un utilisateur (ADMIN uniquement)
  async updateUser({ id, utilisateur, token }: UpdateUserParams): Promise<UtilisateurResponse> {
    return apiRequest<UtilisateurResponse>(`/api/users/${id}`, token, {
      method: "PUT",
      body: JSON.stringify(utilisateur),
    })
  }

  // Supprimer un utilisateur (ADMIN uniquement)
  async deleteUser({ id, token }: DeleteUserParams): Promise<void> {
    return apiRequest<void>(`/api/users/${id}`, token, {
      method: "DELETE",
    })
  }
}

export const userService = new UserService()
