package ma.mundiapolis.empruntsservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.mundiapolis.empruntsservice.dto.EmpruntRequest;
import ma.mundiapolis.empruntsservice.dto.EmpruntResponse;
import ma.mundiapolis.empruntsservice.dto.UserDTO;
import ma.mundiapolis.empruntsservice.exception.BusinessRuleException;
import ma.mundiapolis.empruntsservice.exception.ResourceNotFoundException;
import ma.mundiapolis.empruntsservice.mapper.EmpruntMapper;
import ma.mundiapolis.empruntsservice.model.Emprunt;
import ma.mundiapolis.empruntsservice.model.StatutEmprunt;
import ma.mundiapolis.empruntsservice.repository.EmpruntRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class EmpruntService implements IEmpruntService {

    private final EmpruntRepository empruntRepository;
    private final EmpruntMapper empruntMapper;
    private final WebClient webClient;

    @Override
    public EmpruntResponse createEmprunt(EmpruntRequest empruntRequest) {
        log.info("createEmprunt request received: utilisateurId={}, livreId={}", empruntRequest.getUtilisateurId(),
                empruntRequest.getLivreId());
        // 1. Vérifier si l'utilisateur existe via WebClient
        try {
            UserDTO user = webClient.get()
                    .uri("http://USERSERVICE/api/users/{id}", empruntRequest.getUtilisateurId())
                    .retrieve()
                    .bodyToMono(UserDTO.class)
                    .block(); // .block() car on est dans un service synchrone

            if (user == null) {
                throw new ResourceNotFoundException(
                        "Utilisateur non trouvé avec l'ID : " + empruntRequest.getUtilisateurId());
            }
        } catch (Exception e) {
            throw new ResourceNotFoundException(
                    "Utilisateur non trouvé avec l'ID : " + empruntRequest.getUtilisateurId());
        }

        // 2. Vérifier la disponibilité du livre via WebClient
        try {
            Boolean available = webClient.get()
                    .uri("http://BOOKSERVICE/api/books/{id}/availability", empruntRequest.getLivreId())
                    .retrieve()
                    .bodyToMono(Boolean.class)
                    .block();

            if (Boolean.FALSE.equals(available)) {
                throw new BusinessRuleException("Livre indisponible avec l'ID : " + empruntRequest.getLivreId());
            }
        } catch (Exception e) {
            throw new ResourceNotFoundException("Livre non trouvé avec l'ID : " + empruntRequest.getLivreId());
        }

        // 3. Vérifier localement si le livre est déjà emprunté (Double check)
        boolean estEmprunte = empruntRepository.existsByLivreIdAndStatutIn(
                empruntRequest.getLivreId(),
                List.of(StatutEmprunt.ACTIF, StatutEmprunt.EN_RETARD));

        // Log the double-check result for diagnostics
        log.info("Double-check: estEmprunte for livre {} = {}", empruntRequest.getLivreId(), estEmprunte);

        if (estEmprunte) {
            throw new BusinessRuleException("Ce livre est déjà en cours d'emprunt");
        }

        // 4. Créer l'emprunt
        Emprunt emprunt = Emprunt.builder()
                .utilisateurId(empruntRequest.getUtilisateurId())
                .livreId(empruntRequest.getLivreId())
                .dateEmprunt(LocalDate.now())
                .dateRetourPrevue(LocalDate.now().plusDays(14)) // Règle métier : 14 jours
                .statut(StatutEmprunt.ACTIF)
                .build();

        Emprunt savedEmprunt = empruntRepository.save(emprunt);
        return empruntMapper.toResponse(savedEmprunt);
    }

    @Override
    public EmpruntResponse returnEmprunt(Long id) {
        Emprunt emprunt = empruntRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Emprunt non trouvé avec l'ID : " + id));

        if (emprunt.getStatut() == StatutEmprunt.RETOURNE) {
            throw new BusinessRuleException("Cet emprunt est déjà retourné");
        }

        emprunt.setDateRetourEffective(LocalDate.now());
        emprunt.setStatut(StatutEmprunt.RETOURNE);

        Emprunt updatedEmprunt = empruntRepository.save(emprunt);
        return empruntMapper.toResponse(updatedEmprunt);
    }

    @Override
    @Transactional(readOnly = true)
    public EmpruntResponse getEmpruntById(Long id) {
        Emprunt emprunt = empruntRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Emprunt non trouvé avec l'ID : " + id));
        return empruntMapper.toResponse(emprunt);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmpruntResponse> getEmpruntsByUserId(Long userId) {
        return empruntMapper.toResponseList(empruntRepository.findByUtilisateurId(userId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmpruntResponse> getEmpruntsByBookId(Long bookId) {
        log.info("getEmpruntsByBookId called for bookId={}", bookId);
        List<EmpruntResponse> loans = empruntMapper.toResponseList(empruntRepository.findByLivreId(bookId));
        log.info("Found {} loan(s) for bookId={}", loans.size(), bookId);
        return loans;
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmpruntResponse> getOverdueEmprunts() {
        return empruntMapper.toResponseList(
                empruntRepository.findByDateRetourPrevueBeforeAndStatut(LocalDate.now(), StatutEmprunt.ACTIF));
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmpruntResponse> getAllEmprunts() {
        return empruntMapper.toResponseList(empruntRepository.findAll());
    }
}
