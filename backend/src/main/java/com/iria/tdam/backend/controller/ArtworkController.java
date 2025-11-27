//ArtworkController.java
//align api call from frontend
package com.iria.tdam.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.iria.tdam.backend.services.ArtworkService;
import com.iria.tdam.backend.dto.ArtworkDto;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ArtworkController {
    @Autowired
    private ArtworkService artworkService;

    // GET /api/artworks?query=painting
    @GetMapping("/artworks")
    public List<ArtworkDto> getArtworks(@RequestParam(defaultValue = "painting") String query) {
        return artworkService.getArtworks(query);
    }

}
