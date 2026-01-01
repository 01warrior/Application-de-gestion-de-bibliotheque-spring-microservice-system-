package ma.mundiapolis.userservice.repository;

import ma.mundiapolis.userservice.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    
    /**
     * Recherche un utilisateur par email
     */
    Optional<Utilisateur> findByEmail(String email);
    
    /**
     * Vérifie si un email existe déjà
     */
    boolean existsByEmail(String email);
    
    /**
     * Recherche des utilisateurs par nom (insensible à la casse)
     */
    @Query("SELECT u FROM Utilisateur u WHERE LOWER(u.nom) LIKE LOWER(CONCAT('%', :nom, '%'))")
    List<Utilisateur> findByNomContainingIgnoreCase(@Param("nom") String nom);
    
    /**
     * Recherche des utilisateurs par email (insensible à la casse)
     */
    @Query("SELECT u FROM Utilisateur u WHERE LOWER(u.email) LIKE LOWER(CONCAT('%', :email, '%'))")
    List<Utilisateur> findByEmailContainingIgnoreCase(@Param("email") String email);
    
    /**
     * Recherche des utilisateurs par nom ou email
     */
    @Query("SELECT u FROM Utilisateur u WHERE " +
           "LOWER(u.nom) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Utilisateur> searchByNomOrEmail(@Param("query") String query);
}