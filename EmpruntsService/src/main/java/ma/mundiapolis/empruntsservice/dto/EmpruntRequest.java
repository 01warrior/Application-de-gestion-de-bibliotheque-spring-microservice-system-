package ma.mundiapolis.empruntsservice.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmpruntRequest {
    @NotNull(message = "L'ID de l'utilisateur est obligatoire")
    private Long utilisateurId;
    
    @NotNull(message = "L'ID du livre est obligatoire")
    private Long livreId;
}
