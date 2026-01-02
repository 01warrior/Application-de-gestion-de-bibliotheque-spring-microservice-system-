package ma.mundiapolis.userservice.service;

import ma.mundiapolis.userservice.dto.RegisterRequest;
import ma.mundiapolis.userservice.model.Utilisateur;

import java.util.List;

public interface IUtilisateurService {

    /**
     * Recherche un utilisateur par ID
     */
    Utilisateur findById(Long id);

    /**
     * Recherche un utilisateur par email
     */
    Utilisateur findByEmail(String email);

    /**
     * Recherche des utilisateurs par nom ou email
     */
    List<Utilisateur> searchUsers(String query);

    /**
     * Met à jour le profil d'un utilisateur
     */
    Utilisateur updateProfile(Long userId, RegisterRequest request);

    /**
     * Récupère tous les utilisateurs (pour les admins)
     */
    List<Utilisateur> findAll();

    /**
     * Mettre à jour un utilisateur (ADMIN)
     */
    Utilisateur updateUser(Long id, ma.mundiapolis.userservice.dto.UpdateUserRequest request);

    /**
     * Supprimer un utilisateur (ADMIN)
     */
    void deleteUser(Long id);
}