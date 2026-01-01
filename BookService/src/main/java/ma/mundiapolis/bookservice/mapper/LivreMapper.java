package ma.mundiapolis.bookservice.mapper;

import ma.mundiapolis.bookservice.dto.LivreRequest;
import ma.mundiapolis.bookservice.dto.LivreResponse;
import ma.mundiapolis.bookservice.model.Livre;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface LivreMapper {
    LivreResponse toResponse(Livre livre);
    
    List<LivreResponse> toResponseList(List<Livre> livres);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateCreation", ignore = true)
    @Mapping(target = "dateModification", ignore = true)
    Livre toEntity(LivreRequest request);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateCreation", ignore = true)
    @Mapping(target = "dateModification", ignore = true)
    void updateEntityFromRequest(LivreRequest request, @MappingTarget Livre livre);
}
