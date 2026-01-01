package ma.mundiapolis.empruntsservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.mundiapolis.empruntsservice.model.StatutEmprunt;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmpruntResponse {
    private Long id;
    private Long utilisateurId;
    private Long livreId;
    private LocalDate dateEmprunt;
    private LocalDate dateRetourPrevue;
    private LocalDate dateRetourEffective;
    private StatutEmprunt statut;
    private LocalDateTime dateCreation;
}
