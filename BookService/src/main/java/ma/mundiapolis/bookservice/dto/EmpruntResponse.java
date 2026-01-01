package ma.mundiapolis.bookservice.dto;

import lombok.Data;

@Data
public class EmpruntResponse {
    private Long id;
    private String statut; // We only really need the status
}
