package ma.mundiapolis.userservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.mundiapolis.userservice.dto.*;
import ma.mundiapolis.userservice.mapper.UtilisateurMapper;
import ma.mundiapolis.userservice.model.Utilisateur;
import ma.mundiapolis.userservice.service.IAuthService;
import ma.mundiapolis.userservice.service.IUtilisateurService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UtilisateurController {
    
    private final IAuthService authService;
    private final IUtilisateurService utilisateurService;
    private final UtilisateurMapper utilisateurMapper;
    
    /**
     * Inscription d'un nouvel utilisateur
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Demande d'inscription reçue pour: {}", request.getEmail());
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Authentification d'un utilisateur
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Demande de connexion reçue pour: {}", request.getEmail());
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Obtenir le profil de l'utilisateur connecté
     */
    @GetMapping("/profile")
    public ResponseEntity<UtilisateurResponse> getProfile(@RequestHeader("Authorization") String token) {
        // Extraire le token (enlever "Bearer ")
        String jwtToken = token.substring(7);
        String email = authService.getEmailFromToken(jwtToken);
        
        Utilisateur utilisateur = utilisateurService.findByEmail(email);
        UtilisateurResponse response = utilisateurMapper.toResponse(utilisateur);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Mettre à jour le profil de l'utilisateur connecté
     */
    @PutMapping("/profile")
    public ResponseEntity<UtilisateurResponse> updateProfile(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody RegisterRequest request) {
        
        // Extraire le token (enlever "Bearer ")
        String jwtToken = token.substring(7);
        String email = authService.getEmailFromToken(jwtToken);
        
        Utilisateur currentUser = utilisateurService.findByEmail(email);
        Utilisateur updatedUser = utilisateurService.updateProfile(currentUser.getId(), request);
        UtilisateurResponse response = utilisateurMapper.toResponse(updatedUser);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Obtenir un utilisateur par ID (admin seulement)
     */
    @GetMapping("/{id}")
    public ResponseEntity<UtilisateurResponse> getUserById(@PathVariable Long id) {
        Utilisateur utilisateur = utilisateurService.findById(id);
        UtilisateurResponse response = utilisateurMapper.toResponse(utilisateur);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Rechercher des utilisateurs (admin seulement)
     */
    @GetMapping("/search")
    public ResponseEntity<List<UtilisateurResponse>> searchUsers(@RequestParam String query) {
        List<Utilisateur> utilisateurs = utilisateurService.searchUsers(query);
        List<UtilisateurResponse> responses = utilisateurMapper.toResponseList(utilisateurs);
        return ResponseEntity.ok(responses);
    }
    
    /**
     * Obtenir tous les utilisateurs (admin seulement)
     */
    @GetMapping
    public ResponseEntity<List<UtilisateurResponse>> getAllUsers() {
        List<Utilisateur> utilisateurs = utilisateurService.findAll();
        List<UtilisateurResponse> responses = utilisateurMapper.toResponseList(utilisateurs);
        return ResponseEntity.ok(responses);
    }
}