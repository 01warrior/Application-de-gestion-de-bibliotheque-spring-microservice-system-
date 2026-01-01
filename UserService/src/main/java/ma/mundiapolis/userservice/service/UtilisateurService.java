package ma.mundiapolis.userservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.mundiapolis.userservice.dto.RegisterRequest;
import ma.mundiapolis.userservice.exception.EmailAlreadyExistsException;
import ma.mundiapolis.userservice.exception.ResourceNotFoundException;
import ma.mundiapolis.userservice.mapper.UtilisateurMapper;
import ma.mundiapolis.userservice.model.Utilisateur;
import ma.mundiapolis.userservice.repository.UtilisateurRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UtilisateurService implements IUtilisateurService {
    
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final UtilisateurMapper utilisateurMapper;
    
    @Override
    @Transactional(readOnly = true)
    public Utilisateur findById(Long id) {
        return utilisateurRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'ID: " + id));
    }
    
    @Override
    @Transactional(readOnly = true)
    public Utilisateur findByEmail(String email) {
        return utilisateurRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'email: " + email));
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Utilisateur> searchUsers(String query) {
        log.info("Recherche d'utilisateurs avec la requête: {}", query);
        return utilisateurRepository.searchByNomOrEmail(query);
    }
    
    @Override
    @Transactional
    public Utilisateur updateProfile(Long userId, RegisterRequest request) {
        log.info("Mise à jour du profil pour l'utilisateur ID: {}", userId);
        
        Utilisateur utilisateur = findById(userId);
        
        // Vérifier si l'email a changé et s'il n'existe pas déjà
        if (!utilisateur.getEmail().equals(request.getEmail()) && 
            utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Un utilisateur avec cet email existe déjà");
        }
        
        // Mettre à jour les informations avec MapStruct
        utilisateurMapper.updateEntityFromRequest(request, utilisateur);
        
        // Mettre à jour le mot de passe si fourni
        if (request.getMotDePasse() != null && !request.getMotDePasse().isEmpty()) {
            utilisateur.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        }
        
        utilisateur = utilisateurRepository.save(utilisateur);
        log.info("Profil mis à jour avec succès pour l'utilisateur: {}", utilisateur.getEmail());
        
        return utilisateur;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Utilisateur> findAll() {
        return utilisateurRepository.findAll();
    }
}