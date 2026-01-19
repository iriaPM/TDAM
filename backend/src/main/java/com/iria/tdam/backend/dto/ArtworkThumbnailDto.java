//artwork thumbnail dto
//data transfer object for artwork thumbnails in collections

package com.iria.tdam.backend.dto;

public class ArtworkThumbnailDto {

    private String artworkId;
    private String imageUrl;

    public ArtworkThumbnailDto() {}

    public ArtworkThumbnailDto(String artworkId, String imageUrl) {
        this.artworkId = artworkId;
        this.imageUrl = imageUrl;
    }

    public String getArtworkId() {
        return artworkId;
    }

    public void setArtworkId(String artworkId) {
        this.artworkId = artworkId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
