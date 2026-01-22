//collection detail dto
//data transfer object for detailed collection view

package com.iria.tdam.backend.dto;

import java.util.List;
import java.util.UUID;

public class CollectionDetailDto {

    private UUID id;
    private String title;
    private String description;
    private String username;
    private String avatarUrl;
    private boolean isPrivate;
    private List<ArtworkThumbnailDto> artworks;
    private boolean isOwner;

    // getters & setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public boolean isPrivate() {
        return isPrivate;
    }

    public void setPrivate(boolean isPrivate) {
        this.isPrivate = isPrivate;
    }

    public List<ArtworkThumbnailDto> getArtworks() {
        return artworks;
    }

    public void setArtworks(List<ArtworkThumbnailDto> artworks) {
        this.artworks = artworks;
    }

    public boolean isOwner() {
        return isOwner;
    }

    public void setOwner(boolean isOwner) {
        this.isOwner = isOwner;
    }
}
