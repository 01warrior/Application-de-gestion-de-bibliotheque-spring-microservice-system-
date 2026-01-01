package ma.mundiapolis.empruntsservice.dto;

import lombok.Data;

@Data
public class BookDTO {
    private Long id;
    private String titre;
    private String isbn;
}
