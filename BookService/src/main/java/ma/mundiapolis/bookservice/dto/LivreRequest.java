package ma.mundiapolis.bookservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LivreRequest {
    @NotBlank(message = "Le titre est obligatoire")
    @Size(max = 255, message = "Le titre ne doit pas dépasser 255 caractères")
    private String titre;
    
    @NotBlank(message = "L'auteur est obligatoire")
    @Size(max = 255, message = "L'auteur ne doit pas dépasser 255 caractères")
    private String auteur;
    
    @NotBlank(message = "La catégorie est obligatoire")
    @Size(max = 100, message = "La catégorie ne doit pas dépasser 100 caractères")
    private String categorie;
    
    @NotBlank(message = "L'ISBN est obligatoire")
    @Pattern(regexp = "^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$", message = "Format ISBN invalide")
    private String isbn;
}
