package ma.mundiapolis.empruntsservice.mapper;

import ma.mundiapolis.empruntsservice.dto.EmpruntRequest;
import ma.mundiapolis.empruntsservice.dto.EmpruntResponse;
import ma.mundiapolis.empruntsservice.model.Emprunt;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface EmpruntMapper {
    EmpruntResponse toResponse(Emprunt emprunt);
    
    List<EmpruntResponse> toResponseList(List<Emprunt> emprunts);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateEmprunt", ignore = true)
    @Mapping(target = "dateRetourPrevue", ignore = true)
    @Mapping(target = "dateRetourEffective", ignore = true)
    @Mapping(target = "statut", ignore = true)
    @Mapping(target = "dateCreation", ignore = true)
    Emprunt toEntity(EmpruntRequest request);
}
