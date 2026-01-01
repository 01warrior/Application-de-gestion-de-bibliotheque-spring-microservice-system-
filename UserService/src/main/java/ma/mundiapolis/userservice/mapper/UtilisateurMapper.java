package ma.mundiapolis.userservice.mapper;

import ma.mundiapolis.userservice.dto.RegisterRequest;
import ma.mundiapolis.userservice.dto.UtilisateurResponse;
import ma.mundiapolis.userservice.model.Utilisateur;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface UtilisateurMapper {
    
    /**
     * Convertit une entité Utilisateur en UtilisateurResponse
     */
    UtilisateurResponse toResponse(Utilisateur utilisateur);
    
    /**
     * Convertit une liste d'entités Utilisateur en liste d'UtilisateurResponse
     */
    List<UtilisateurResponse> toResponseList(List<Utilisateur> utilisateurs);
    
    /**
     * Convertit un RegisterRequest en entité Utilisateur
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateInscription", ignore = true)
    @Mapping(target = "role", ignore = true)
    Utilisateur toEntity(RegisterRequest request);
    
    /**
     * Met à jour une entité Utilisateur existante avec les données d'un RegisterRequest
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateInscription", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "motDePasse", ignore = true) // Le mot de passe sera géré séparément
    void updateEntityFromRequest(RegisterRequest request, @MappingTarget Utilisateur utilisateur);
}