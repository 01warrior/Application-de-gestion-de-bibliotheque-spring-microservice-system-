package ma.mundiapolis.userservice.service;

import ma.mundiapolis.userservice.dto.AuthResponse;
import ma.mundiapolis.userservice.dto.LoginRequest;
import ma.mundiapolis.userservice.dto.RegisterRequest;

public interface IAuthService {
    
    /**
     * Inscription d'un nouvel utilisateur
     */
    AuthResponse register(RegisterRequest request);
    
    /**
     * Authentification d'un utilisateur
     */
    AuthResponse login(LoginRequest request);
    
    /**
     * Valide un token JWT
     */
    boolean validateToken(String token);
    
    /**
     * Extrait l'email du token
     */
    String getEmailFromToken(String token);
}