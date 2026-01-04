package ma.mundiapolis.bookservice.dto;

import lombok.Data;

@Data
public class EmpruntResponse {
    private Long id;
    private String statut; // Jai besoin du statut juste en realité
}
