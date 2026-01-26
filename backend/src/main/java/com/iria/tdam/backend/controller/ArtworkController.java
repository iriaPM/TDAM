//ArtworkController.java
//align api call from frontend
package com.iria.tdam.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.iria.tdam.backend.services.ArtworkService;
import com.iria.tdam.backend.services.HarvardArtworkService;
import com.iria.tdam.backend.dto.ArtworkDto;
import com.iria.tdam.backend.dto.SaveArtworkRequest;
import com.iria.tdam.backend.model.User;
import com.iria.tdam.backend.services.CollectionService;
import com.iria.tdam.backend.services.UserService;

import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ArtworkController {
    @Autowired
    private ArtworkService artworkService;
    @Autowired
    private HarvardArtworkService harvardArtworkService;

    private final CollectionService collectionService;
    private final UserService userService;

    public ArtworkController(
            ArtworkService artworkService,
            HarvardArtworkService harvardArtworkService,
            CollectionService collectionService,
            UserService userService) {
        this.artworkService = artworkService;
        this.harvardArtworkService = harvardArtworkService;
        this.collectionService = collectionService;
        this.userService = userService;
    }

    @GetMapping("/artworks/random")
    public List<ArtworkDto> getRandomArtworks(
            @RequestHeader(value = "Authorization", required = false) String token) {
        User user = token != null
                ? userService.getProfile(token.replace("Bearer ", ""))
                : null;

        Set<String> savedIds = user != null
                ? collectionService.getSavedArtworkIds(user)
                : Set.of();

        List<ArtworkDto> result = new ArrayList<>();
        result.addAll(artworkService.getRandomArtworks());
        result.addAll(harvardArtworkService.getRandomArtworks());
        Collections.shuffle(result);

        return result.stream()
                .limit(10)
                .peek(a -> a.setIsSaved(savedIds.contains(a.getObjectID())))
                .toList();
    }

    @GetMapping("/artworks/search")
    public List<ArtworkDto> searchArtworks(
            @RequestParam String query,
            @RequestHeader(value = "Authorization", required = false) String token) {

        User user = token != null
                ? userService.getProfile(token.replace("Bearer ", ""))
                : null;

        Set<String> savedIds = user != null
                ? collectionService.getSavedArtworkIds(user)
                : Set.of();

        List<ArtworkDto> result = new ArrayList<>();
        result.addAll(artworkService.getArtworks(query)); // Met
        result.addAll(harvardArtworkService.searchArtworks(query)); // Harvard
        Collections.shuffle(result);

        return result.stream()
                .limit(10)
                .peek(a -> a.setIsSaved(savedIds.contains(a.getObjectID())))
                .toList();
    }

    @PostMapping("/artworks/save")
    public Map<String, Boolean> toggleSaveArtwork(
            @RequestHeader("Authorization") String token,
            @RequestBody SaveArtworkRequest req) {
        User user = userService.getProfile(token.replace("Bearer ", ""));

        boolean saved = collectionService.toggleSavedArtwork(
                user,
                req.artworkId(),
                req.imageUrl());

        return Map.of("isSaved", saved);
    }

}
