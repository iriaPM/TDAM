//recommendationcontroller.java
package com.iria.tdam.backend.controller;

import com.iria.tdam.backend.services.RecommendationService;
import com.iria.tdam.backend.services.UserService;
import com.iria.tdam.backend.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "*")
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final UserService userService;

    public RecommendationController(
            RecommendationService recommendationService,
            UserService userService) {
        this.recommendationService = recommendationService;
        this.userService = userService;
    }

    // artwork recommendations
    @GetMapping("/artworks")
    public ResponseEntity<Object> getArtworkRecommendations(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "10") int topN) {

        User user = userService.getProfile(token.replace("Bearer ", ""));

        Object recommendations = recommendationService.getArtworkRecommendations(
                user.getId(), topN);

        if (recommendations == null) {
            return ResponseEntity.status(503).body("ML service unavailable");
        }

        return ResponseEntity.ok(recommendations);
    }

    // collection recommendations
    @GetMapping("/collections")
    public ResponseEntity<Object> getCollectionRecommendations(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "10") int topN) {

        User user = userService.getProfile(token.replace("Bearer ", ""));

        Object recommendations = recommendationService.getCollectionRecommendations(
                user.getId(), topN);

        if (recommendations == null) {
            return ResponseEntity.status(503).body("ML service unavailable");
        }

        return ResponseEntity.ok(recommendations);
    }
}
