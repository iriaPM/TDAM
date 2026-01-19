//ToggleArtworkRequest.java
//dto for toggling artwork in a collection
package com.iria.tdam.backend.dto;

public class ToggleArtworkRequest {

    private String artworkId;
    private String imageUrl;

    public String getArtworkId() { return artworkId; }
    public String getImageUrl() { return imageUrl; }
}
