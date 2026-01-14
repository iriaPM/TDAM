//artwork service file
//in this file I have all the api calls needed for the artworks
package com.iria.tdam.backend.services;

import org.springframework.cache.annotation.CacheConfig;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;
import java.util.stream.Collectors;
import com.iria.tdam.backend.dto.ArtworkDto;
import com.iria.tdam.backend.dto.MetObjectResponse;
import org.springframework.cache.annotation.Cacheable;

@Service
@CacheConfig(cacheNames = "artworks")
public class ArtworkService {

    private final RestTemplate restTemplate = new RestTemplate();

    // --- API DTO for list of all Met objects
    public static class MetAllObjectsResponse {
        public List<Integer> objectIDs;
    }

    // --- Search for artworks
    public List<Integer> searchArtworks(String query) {
        String url = "https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=" + query;

        MetSearchResponse response;
        try {
            response = restTemplate.getForObject(url, MetSearchResponse.class);
        } catch (Exception e) {
            return List.of();
        }

        return (response != null && response.objectIDs != null)
                ? response.objectIDs
                : List.of();
    }

    // --- Fetch a single artwork details
    public ArtworkDto getArtworkById(int id) {
        String url = "https://collectionapi.metmuseum.org/public/collection/v1/objects/" + id;

        MetObjectResponse response;
        try {
            response = restTemplate.getForObject(url, MetObjectResponse.class);
        } catch (Exception e) {
            return null;
        }

        if (response == null)
            return null;

        // pick best image
        String imageUrl = response.primaryImageSmall;
        if (imageUrl == null || imageUrl.isEmpty()) {
            imageUrl = response.primaryImage;
        }
        if ((imageUrl == null || imageUrl.isEmpty())
                && response.additionalImages != null
                && !response.additionalImages.isEmpty()) {
            imageUrl = response.additionalImages.get(0);
        }

        if (imageUrl == null || imageUrl.isEmpty())
            return null;

        ArtworkDto dto = new ArtworkDto();
        dto.setObjectID(String.valueOf(id));
        dto.setTitle(response.title);
        dto.setArtist(response.artistDisplayName);
        dto.setMedium(response.medium);
        dto.setObjectDate(response.objectDate);
        dto.setImageUrl(imageUrl);

        return dto;
    }

    // --- Search results
    @Cacheable(value = "searchArtworks", key = "#query")
    public List<ArtworkDto> getArtworks(String query) {
        List<Integer> ids = searchArtworks(query);
        if (ids == null || ids.isEmpty())
            return List.of();

        return ids.stream()
                .limit(10)
                .map(this::getArtworkById)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    // --- Random artworks
    @Cacheable(value = "randomArtworks")
    public List<ArtworkDto> getRandomArtworks() {
        String url = "https://collectionapi.metmuseum.org/public/collection/v1/objects";

        MetAllObjectsResponse response;
        try {
            response = restTemplate.getForObject(url, MetAllObjectsResponse.class);
        } catch (Exception e) {
            return List.of();
        }

        if (response == null || response.objectIDs == null || response.objectIDs.isEmpty())
            return List.of();

        Collections.shuffle(response.objectIDs);

        return response.objectIDs.stream()
                .limit(30)
                .map(this::getArtworkById)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }
}
