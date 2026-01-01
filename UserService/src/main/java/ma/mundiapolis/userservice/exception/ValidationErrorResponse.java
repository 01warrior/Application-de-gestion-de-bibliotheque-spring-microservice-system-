package ma.mundiapolis.userservice.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ValidationErrorResponse extends ErrorResponse {
    private Map<String, String> fieldErrors;
    
    public ValidationErrorResponse(String code, String message, LocalDateTime timestamp, Map<String, String> fieldErrors) {
        super(code, message, timestamp);
        this.fieldErrors = fieldErrors;
    }
}