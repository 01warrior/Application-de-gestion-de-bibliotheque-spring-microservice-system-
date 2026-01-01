package ma.mundiapolis.empruntsservice.service;

import ma.mundiapolis.empruntsservice.dto.EmpruntRequest;
import ma.mundiapolis.empruntsservice.dto.EmpruntResponse;

import java.util.List;

public interface IEmpruntService {
    EmpruntResponse createEmprunt(EmpruntRequest empruntRequest);
    EmpruntResponse returnEmprunt(Long id);
    EmpruntResponse getEmpruntById(Long id);
    List<EmpruntResponse> getEmpruntsByUserId(Long userId);
    List<EmpruntResponse> getEmpruntsByBookId(Long bookId);
    List<EmpruntResponse> getOverdueEmprunts();
}
