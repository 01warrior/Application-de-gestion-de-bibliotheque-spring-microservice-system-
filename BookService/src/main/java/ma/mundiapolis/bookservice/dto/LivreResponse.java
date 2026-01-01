package ma.mundiapolis.bookservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LivreResponse {
    private Long id;
    private String titre;
    private String auteur;
    private String categorie;
    private String isbn;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}
