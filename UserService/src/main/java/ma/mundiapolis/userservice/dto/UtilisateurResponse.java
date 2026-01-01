package ma.mundiapolis.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.mundiapolis.userservice.model.Role;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UtilisateurResponse {
    private Long id;
    private String nom;
    private String email;
    private String adresse;
    private String telephone;
    private Role role;
    private LocalDateTime dateInscription;
}