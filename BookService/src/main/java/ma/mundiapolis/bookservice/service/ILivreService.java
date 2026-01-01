package ma.mundiapolis.bookservice.service;

import ma.mundiapolis.bookservice.dto.LivreRequest;
import ma.mundiapolis.bookservice.dto.LivreResponse;

import java.util.List;

public interface ILivreService {
    LivreResponse createLivre(LivreRequest livreRequest);
    LivreResponse updateLivre(Long id, LivreRequest livreRequest);
    LivreResponse getLivreById(Long id);
    List<LivreResponse> getAllLivres();
    List<LivreResponse> searchLivres(String query);
    void deleteLivre(Long id);
    boolean checkAvailability(Long id);
}
