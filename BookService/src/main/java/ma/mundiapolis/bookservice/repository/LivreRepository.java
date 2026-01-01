package ma.mundiapolis.bookservice.repository;

import ma.mundiapolis.bookservice.model.Livre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LivreRepository extends JpaRepository<Livre, Long> {
    List<Livre> findByTitreContainingIgnoreCaseOrAuteurContainingIgnoreCase(String titre, String auteur);
    Optional<Livre> findByIsbn(String isbn);
    boolean existsByIsbn(String isbn);
}
