//ArtworkController.java
//align api call from frontend
package com.iria.tdam.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.iria.tdam.backend.services.ArtworkService;
import com.iria.tdam.backend.services.HarvardArtworkService;
import com.iria.tdam.backend.dto.ArtworkDto;
import java.util.Collections;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ArtworkController {
    @Autowired
    private ArtworkService artworkService;
    @Autowired
    private HarvardArtworkService harvardArtworkService;

    @GetMapping("/artworks/random")
    public List<ArtworkDto> getRandomArtworks() {
        List<ArtworkDto> result = new ArrayList<>();
        result.addAll(artworkService.getRandomArtworks());
        result.addAll(harvardArtworkService.getRandomArtworks());
        Collections.shuffle(result);
        return result.stream().limit(10).toList();
    }

    @GetMapping("/artworks/search")
    public List<ArtworkDto> searchArtworks(@RequestParam String query) {
        List<ArtworkDto> result = new ArrayList<>();
        result.addAll(artworkService.getArtworks(query)); // Met
        result.addAll(harvardArtworkService.searchArtworks(query)); // Harvard
        Collections.shuffle(result);
        return result
                .stream()
                .limit(10)
                .toList();
    }

}
