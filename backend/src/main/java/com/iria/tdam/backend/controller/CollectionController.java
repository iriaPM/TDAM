//collection controller
//handles HTTP requests related to collections
package com.iria.tdam.backend.controller;

import com.iria.tdam.backend.dto.*;
import com.iria.tdam.backend.model.*;
import com.iria.tdam.backend.services.CollectionService;
import com.iria.tdam.backend.services.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/collections")
@CrossOrigin(origins = "*")
public class CollectionController {

    private final CollectionService collectionService;
    private final UserService userService;

    public CollectionController(
            CollectionService collectionService,
            UserService userService) {
        this.collectionService = collectionService;
        this.userService = userService;
    }

    // public collections
    @GetMapping("/public")
    public List<CollectionFeedDto> getPublicCollections() {
        return collectionService.getPublicCollections();
    }

    // user collections
    @GetMapping("/me")
    public List<CollectionFeedDto> getMyCollections(
            @RequestHeader("Authorization") String token) {
        User user = userService.getProfile(token.replace("Bearer ", ""));
        return collectionService.getUserCollections(user);
    }

    // collection detail
    @GetMapping("/{id}")
    public CollectionDetailDto getCollectionDetail(
            @RequestHeader("Authorization") String token,
            @PathVariable UUID id) {

        User user = userService.getProfile(token.replace("Bearer ", ""));
        return collectionService.getCollectionDetail(id, user);
    }

    // toggle artwork in collection
    @PostMapping("/{id}/artworks")
    public void toggleArtworkInCollection(
            @RequestHeader("Authorization") String token,
            @PathVariable UUID id,
            @RequestBody ToggleArtworkRequest request) {
        User user = userService.getProfile(token.replace("Bearer ", ""));

        collectionService.toggleArtwork(
                user,
                id,
                request.getArtworkId(),
                request.getImageUrl());
    }

    // toogle privacy
    @PatchMapping("/{id}/privacy")
    public CollectionFeedDto togglePrivacy(
            @RequestHeader("Authorization") String token,
            @PathVariable UUID id) {
        User user = userService.getProfile(token.replace("Bearer ", ""));
        return collectionService.togglePrivacy(user, id);
    }

    // update edit collection name and description
    @PatchMapping("/{id}")
    public CollectionDetailDto updateCollection(
            @RequestHeader("Authorization") String token,
            @PathVariable UUID id,
            @RequestBody CreateCollectionRequest request) {
        User user = userService.getProfile(token.replace("Bearer ", ""));

        Collection updated = collectionService.updateCollection(
                user,
                id,
                request.getTitle(),
                request.getDescription());

        return collectionService.getCollectionDetail(updated.getId(), user);
    }

    @PostMapping
    public CollectionFeedDto createCollection(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestBody CreateCollectionRequest request) {
        System.out.println("REQUEST = " + request);

        if (token == null) {
            throw new IllegalArgumentException("Missing Authorization header");
        }

        User user = userService.getProfile(token.replace("Bearer ", ""));

        Collection collection = collectionService.createCollection(
                user,
                request.getTitle(),
                request.getDescription(),
                request.isPrivate());

        return collectionService.toFeedDto(collection);
    }

}
