// ArtistController 
//align api call from frontend
package com.iria.tdam.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.iria.tdam.backend.dto.ArtistDetailDto;
import com.iria.tdam.backend.services.ArtistService;

@RestController
@RequestMapping("/api/artists")
@CrossOrigin(origins = "*")
public class ArtistController {
    private final ArtistService artistService;

    public ArtistController(ArtistService artistService) {
        this.artistService = artistService;
    }

    @GetMapping("/search")
    public ArtistDetailDto getArtistDetail(
            @RequestParam String name,
            @RequestHeader(value = "Authorization", required = false) String token) {
        return artistService.getArtistDetail(name);
    }
}