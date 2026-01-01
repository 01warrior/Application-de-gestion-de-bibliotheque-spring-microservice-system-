package ma.mundiapolis.bookservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.mundiapolis.bookservice.dto.LivreRequest;
import ma.mundiapolis.bookservice.dto.LivreResponse;
import ma.mundiapolis.bookservice.service.ILivreService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class LivreController {

    private final ILivreService livreService;

    @PostMapping
    public ResponseEntity<LivreResponse> createLivre(@Valid @RequestBody LivreRequest livreRequest) {
        return new ResponseEntity<>(livreService.createLivre(livreRequest), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LivreResponse> updateLivre(@PathVariable Long id, @Valid @RequestBody LivreRequest livreRequest) {
        return ResponseEntity.ok(livreService.updateLivre(id, livreRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LivreResponse> getLivreById(@PathVariable Long id) {
        return ResponseEntity.ok(livreService.getLivreById(id));
    }

    @GetMapping
    public ResponseEntity<List<LivreResponse>> getAllLivres() {
        return ResponseEntity.ok(livreService.getAllLivres());
    }

    @GetMapping("/search")
    public ResponseEntity<List<LivreResponse>> searchLivres(@RequestParam String query) {
        return ResponseEntity.ok(livreService.searchLivres(query));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLivre(@PathVariable Long id) {
        livreService.deleteLivre(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/availability")
    public ResponseEntity<Boolean> checkAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(livreService.checkAvailability(id));
    }
}
