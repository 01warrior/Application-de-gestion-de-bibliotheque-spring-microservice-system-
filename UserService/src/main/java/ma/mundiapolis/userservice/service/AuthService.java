package ma.mundiapolis.userservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.mundiapolis.userservice.dto.AuthResponse;
import ma.mundiapolis.userservice.dto.LoginRequest;
import ma.mundiapolis.userservice.dto.RegisterRequest;
import ma.mundiapolis.userservice.exception.EmailAlreadyExistsException;
import ma.mundiapolis.userservice.exception.InvalidCredentialsException;
import ma.mundiapolis.userservice.mapper.UtilisateurMapper;
import ma.mundiapolis.userservice.model.Role;
import ma.mundiapolis.userservice.model.Utilisateur;
import ma.mundiapolis.userservice.repository.UtilisateurRepository;
import ma.mundiapolis.userservice.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService implements IAuthService {
    
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UtilisateurMapper utilisateurMapper;
    
    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Tentative d'inscription pour l'email: {}", request.getEmail());
        
        // Vérifier si l'email existe déjà
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Un utilisateur avec cet email existe déjà");
        }
        
        // Créer le nouvel utilisateur avec MapStruct
        Utilisateur utilisateur = utilisateurMapper.toEntity(request);
        utilisateur.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        utilisateur.setRole(Role.USER);
        
        // Sauvegarder l'utilisateur
        utilisateur = utilisateurRepository.save(utilisateur);
        
        // Générer le token JWT
        String token = jwtUtil.generateToken(utilisateur);
        
        log.info("Utilisateur inscrit avec succès: {}", utilisateur.getEmail());
        
        return new AuthResponse(
            token,
            utilisateur.getId(),
            utilisateur.getEmail(),
            utilisateur.getNom(),
            utilisateur.getRole().name()
        );
    }
    
    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        log.info("Tentative de connexion pour l'email: {}", request.getEmail());
        
        // Rechercher l'utilisateur par email
        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new InvalidCredentialsException("Email ou mot de passe incorrect"));
        
        // Vérifier le mot de passe
        if (!passwordEncoder.matches(request.getMotDePasse(), utilisateur.getMotDePasse())) {
            throw new InvalidCredentialsException("Email ou mot de passe incorrect");
        }
        
        // Générer le token JWT
        String token = jwtUtil.generateToken(utilisateur);
        
        log.info("Utilisateur connecté avec succès: {}", utilisateur.getEmail());
        
        return new AuthResponse(
            token,
            utilisateur.getId(),
            utilisateur.getEmail(),
            utilisateur.getNom(),
            utilisateur.getRole().name()
        );
    }
    
    @Override
    public boolean validateToken(String token) {
        return jwtUtil.validateToken(token);
    }
    
    @Override
    public String getEmailFromToken(String token) {
        return jwtUtil.getEmailFromToken(token);
    }
}