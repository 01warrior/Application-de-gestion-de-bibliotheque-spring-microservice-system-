package ma.mundiapolis.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    private String nom;
    private String email;
    private String adresse;
    private String telephone;
    private String motDePasse; // optional
    private String role; // "USER" or "ADMIN"
}
