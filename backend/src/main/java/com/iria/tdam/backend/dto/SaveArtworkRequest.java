//SaveArtworkRequest dto
package com.iria.tdam.backend.dto;

public record SaveArtworkRequest(
        String artworkId,
        String imageUrl
) {}
