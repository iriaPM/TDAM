//collection service
//business logic for managing collections and their artworks

package com.iria.tdam.backend.services;

import com.iria.tdam.backend.dto.*;
import com.iria.tdam.backend.model.Collection;
import com.iria.tdam.backend.model.CollectionArtwork;
import com.iria.tdam.backend.model.User;
import com.iria.tdam.backend.repository.CollectionArtworkRepository;
import com.iria.tdam.backend.repository.CollectionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CollectionService {

    // this is a mapper method to convert Collection entity to
    // CollectionFeedDto(what is shown in feeds)
    public CollectionFeedDto toFeedDto(Collection c) {
        CollectionFeedDto dto = new CollectionFeedDto();
        dto.setId(c.getId());
        dto.setTitle(c.getTitle());
        dto.setUsername(c.getOwner().getUsername());
        dto.setAvatarUrl(null); // future
        dto.setPrivate(c.isPrivate());

        // cover image = first artwork image if exists
        if (c.getArtworks() != null && !c.getArtworks().isEmpty()) {
            dto.setCoverImageUrl(c.getArtworks().get(0).getImageUrl());
        }

        return dto;
    }

    // this is a mapper method to convert Collection entity to
    // CollectionDetailDto(what is shown when user clicks on a collection)
    private CollectionDetailDto toDetailDto(Collection c, User currentUser) {
        CollectionDetailDto dto = new CollectionDetailDto();
        dto.setId(c.getId());
        dto.setTitle(c.getTitle());
        dto.setDescription(c.getDescription());
        dto.setUsername(c.getOwner().getUsername());
        dto.setAvatarUrl(null);
        dto.setPrivate(c.isPrivate());

        dto.setOwner(
                c.getOwner().getId().equals(currentUser.getId()));

        dto.setArtworks(
                c.getArtworks().stream()
                        .map(a -> new ArtworkThumbnailDto(
                                a.getArtworkId(),
                                a.getImageUrl()))
                        .toList());

        return dto;
    }

    private final CollectionRepository collectionRepository;
    private final CollectionArtworkRepository artworkRepository;

    public CollectionService(
            CollectionRepository collectionRepository,
            CollectionArtworkRepository artworkRepository) {
        this.collectionRepository = collectionRepository;
        this.artworkRepository = artworkRepository;
    }

    // create collection
    public Collection createCollection(
            User owner,
            String title,
            String description,
            boolean isPrivate) {
        Collection collection = new Collection();
        collection.setTitle(title);
        collection.setDescription(description);
        collection.setPrivate(isPrivate);
        collection.setOwner(owner);

        return collectionRepository.save(collection);
    }

    // toggle artwork in collection (add if not exists, remove if exists)
    public void toggleArtwork(
            User user,
            UUID collectionId,
            String artworkId,
            String imageUrl) {
        Collection collection = collectionRepository
                .findByIdAndOwner(collectionId, user)
                .orElseThrow(() -> new IllegalArgumentException("Collection not found"));

        artworkRepository
                .findByCollectionAndArtworkId(collection, artworkId)
                .ifPresentOrElse(
                        existing -> artworkRepository.delete(existing),
                        () -> {
                            CollectionArtwork ca = new CollectionArtwork();
                            ca.setCollection(collection);
                            ca.setArtworkId(artworkId);
                            ca.setImageUrl(imageUrl);
                            artworkRepository.save(ca);
                        });
    }

    // public feed
    public List<CollectionFeedDto> getPublicCollections() {
        return collectionRepository.findByIsPrivateFalse()
                .stream()
                .map(this::toFeedDto)
                .toList();
    }

    // user collections
    public List<CollectionFeedDto> getUserCollections(User user) {
        return collectionRepository.findByOwner(user)
                .stream()
                .map(this::toFeedDto)
                .toList();
    }

    // user collection detail
    public CollectionDetailDto getCollectionDetail(UUID id, User currentUser) {
        Collection collection = collectionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Collection not found"));

        return toDetailDto(collection, currentUser);
    }

    // privacy toggle
    public CollectionFeedDto togglePrivacy(User user, UUID collectionId) {
        Collection collection = collectionRepository
                .findByIdAndOwner(collectionId, user)
                .orElseThrow(() -> new IllegalArgumentException("Collection not found"));

        collection.setPrivate(!collection.isPrivate());

        Collection saved = collectionRepository.save(collection);
        return toFeedDto(saved);
    }

    // update collection (name and description)
    public Collection updateCollection(
            User user,
            UUID collectionId,
            String title,
            String description) {
        Collection collection = collectionRepository
                .findByIdAndOwner(collectionId, user)
                .orElseThrow(() -> new IllegalArgumentException("Collection not found"));

        collection.setTitle(title);
        collection.setDescription(description);

        return collectionRepository.save(collection);
    }

}
