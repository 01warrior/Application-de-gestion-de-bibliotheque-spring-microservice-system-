package ma.mundiapolis.empruntsservice.repository;

import ma.mundiapolis.empruntsservice.model.Emprunt;
import ma.mundiapolis.empruntsservice.model.StatutEmprunt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmpruntRepository extends JpaRepository<Emprunt, Long> {
    List<Emprunt> findByUtilisateurId(Long utilisateurId);
    List<Emprunt> findByLivreId(Long livreId);
    
    // Pour vérifier si un livre est déjà emprunté (ACTIF ou EN_RETARD)
    Optional<Emprunt> findByLivreIdAndStatutIn(Long livreId, List<StatutEmprunt> statuts);
    
    // Pour trouver les retards
    List<Emprunt> findByDateRetourPrevueBeforeAndStatut(LocalDate date, StatutEmprunt statut);
    
    boolean existsByLivreIdAndStatutIn(Long livreId, List<StatutEmprunt> statuts);
}
