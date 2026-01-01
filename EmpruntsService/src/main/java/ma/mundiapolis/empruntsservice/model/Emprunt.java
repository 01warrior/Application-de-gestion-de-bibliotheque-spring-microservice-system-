package ma.mundiapolis.empruntsservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Emprunt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    private Long utilisateurId;
    
    @NotNull
    private Long livreId;
    
    @NotNull
    private LocalDate dateEmprunt;
    
    private LocalDate dateRetourPrevue;
    
    private LocalDate dateRetourEffective;
    
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatutEmprunt statut = StatutEmprunt.ACTIF;
    
    @CreationTimestamp
    private LocalDateTime dateCreation;
}
