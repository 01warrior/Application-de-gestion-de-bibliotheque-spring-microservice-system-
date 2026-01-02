package ma.mundiapolis.empruntsservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.mundiapolis.empruntsservice.dto.EmpruntRequest;
import ma.mundiapolis.empruntsservice.dto.EmpruntResponse;
import ma.mundiapolis.empruntsservice.service.IEmpruntService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class EmpruntController {

    private final IEmpruntService empruntService;

    @PostMapping
    public ResponseEntity<EmpruntResponse> createEmprunt(@Valid @RequestBody EmpruntRequest empruntRequest) {
        return new ResponseEntity<>(empruntService.createEmprunt(empruntRequest), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<EmpruntResponse>> getAllEmprunts() {
        return ResponseEntity.ok(empruntService.getAllEmprunts());
    }

    @PutMapping("/{id}/return")
    public ResponseEntity<EmpruntResponse> returnEmprunt(@PathVariable Long id) {
        return ResponseEntity.ok(empruntService.returnEmprunt(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmpruntResponse> getEmpruntById(@PathVariable Long id) {
        return ResponseEntity.ok(empruntService.getEmpruntById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<EmpruntResponse>> getEmpruntsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(empruntService.getEmpruntsByUserId(userId));
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<EmpruntResponse>> getEmpruntsByBookId(@PathVariable Long bookId) {
        return ResponseEntity.ok(empruntService.getEmpruntsByBookId(bookId));
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<EmpruntResponse>> getOverdueEmprunts() {
        return ResponseEntity.ok(empruntService.getOverdueEmprunts());
    }
}
