//MlCollectionDto.java
package com.iria.tdam.backend.dto;

import java.util.UUID;

public class MlCollectionDto {
    private UUID collectionId;
    private String title;
    private String description;
    private Long ownerId;

    // artwork metadata
    private String artists;
    private String periods;
    private String cultures;
    private String mediums;

    public MlCollectionDto(UUID collectionId, String title, String description,
            Long ownerId, String artists, String periods,
            String cultures, String mediums) {
        this.collectionId = collectionId;
        this.title = title;
        this.description = description;
        this.ownerId = ownerId;
        this.artists = artists;
        this.periods = periods;
        this.cultures = cultures;
        this.mediums = mediums;
    }

    // getters
    public UUID getCollectionId() {
        return collectionId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public String getArtists() {
        return artists;
    }

    public String getPeriods() {
        return periods;
    }

    public String getCultures() {
        return cultures;
    }

    public String getMediums() {
        return mediums;
    }
}