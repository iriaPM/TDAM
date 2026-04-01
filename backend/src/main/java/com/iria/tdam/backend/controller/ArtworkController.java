//ArtworkController.java
//align api call from frontend
package com.iria.tdam.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.iria.tdam.backend.services.ArtworkCacheService;
import com.iria.tdam.backend.services.ArtworkService;
import com.iria.tdam.backend.services.HarvardArtworkService;
import com.iria.tdam.backend.dto.ArtworkDto;
import com.iria.tdam.backend.dto.SaveArtworkRequest;
import com.iria.tdam.backend.model.User;
import com.iria.tdam.backend.services.CollectionService;
import com.iria.tdam.backend.services.UserService;
import com.iria.tdam.backend.dto.ViewArtworkRequest;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ArtworkController {
        @Autowired
        private ArtworkService artworkService;
        @Autowired
        private HarvardArtworkService harvardArtworkService;
        @Autowired
        private ArtworkCacheService artworkCacheService;

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

                List<ArtworkDto> result = new ArrayList<>(artworkCacheService.getCachedArtworks());
                Collections.shuffle(result);

                return result.stream()
                                .limit(50)
                                .peek(a -> a.setIsSaved(savedIds.contains(a.getObjectID())))
                                .toList();
        }

        @GetMapping("/artworks/random/internal")
        public List<ArtworkDto> getRandomArtworksInternal(
                        @RequestParam(required = false) String category) {
                List<ArtworkDto> all = artworkCacheService.getCachedArtworks();
                if (category == null || category.isEmpty()) {
                        return all;
                }
                return all.stream()
                                .filter(a -> matchesCategory(a, category))
                                .collect(Collectors.toList());
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

        @GetMapping("/artworks/{artworkId}")
        public ResponseEntity<ArtworkDto> getArtworkDetail(
                        @PathVariable String artworkId,
                        @RequestHeader(value = "Authorization", required = false) String token) {

                User user = token != null
                                ? userService.getProfile(token.replace("Bearer ", ""))
                                : null;

                Set<String> savedIds = user != null
                                ? collectionService.getSavedArtworkIds(user)
                                : Set.of();

                ArtworkDto artwork = artworkCacheService.getArtworkById(artworkId);

                if (artwork == null) {
                        String[] parts = artworkId.split("-", 2);
                        if (parts.length != 2)
                                return ResponseEntity.badRequest().build();

                        String source = parts[0];
                        String id = parts[1];

                        try {
                                if ("met".equalsIgnoreCase(source)) {
                                        artwork = artworkService.getArtworkById(Integer.parseInt(id));
                                } else if ("harvard".equalsIgnoreCase(source)) {
                                        artwork = harvardArtworkService.getArtworkById(Integer.parseInt(id));
                                }
                        } catch (Exception e) {
                                // API fetch failed, artwork stays null
                        }
                }

                if (artwork == null)
                        return ResponseEntity.notFound().build();

                artwork.setIsSaved(savedIds.contains(artwork.getObjectID()));
                return ResponseEntity.ok(artwork);
        }

        @PostMapping("/artworks/viewed")
        public Map<String, String> markArtworkViewed(
                        @RequestHeader("Authorization") String token,
                        @RequestBody ViewArtworkRequest req) {

                User user = userService.getProfile(token.replace("Bearer ", ""));

                // Log the view event
                artworkService.recordArtworkView(user, req.artworkId());

                return Map.of("status", "success");
        }

        private boolean matchesCategory(ArtworkDto artwork, String category) {
                if (category == null || category.isEmpty())
                        return true;
                String lower = category.toLowerCase();
                return (artwork.getArtist() != null && artwork.getArtist().toLowerCase().contains(lower)) ||
                                (artwork.getPeriod() != null && artwork.getPeriod().toLowerCase().contains(lower)) ||
                                (artwork.getCulture() != null && artwork.getCulture().toLowerCase().contains(lower)) ||
                                (artwork.getMedium() != null && artwork.getMedium().toLowerCase().contains(lower));
        }
}
