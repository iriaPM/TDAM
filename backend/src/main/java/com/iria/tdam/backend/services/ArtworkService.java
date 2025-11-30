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

    public static class MetAllObjectsResponse {
        public List<Integer> objectIDs;
    }

    // api call to search specific artworks from user input
    public List<Integer> searchArtworks(String query) {
        String url = "https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=" + query;
        var response = restTemplate.getForObject(url, MetSearchResponse.class);
        return response != null ? response.objectIDs : List.of();
    }

    public ArtworkDto getArtworkById(int id) {
        String url = "https://collectionapi.metmuseum.org/public/collection/v1/objects/" + id;

        var response = restTemplate.getForObject(url, MetObjectResponse.class);

        if (response == null)
            return null;

        ArtworkDto dto = new ArtworkDto();
        String imageUrl = response.primaryImageSmall;

        if (imageUrl == null || imageUrl.isEmpty()) {
            imageUrl = response.primaryImage;
        }
        if ((imageUrl == null || imageUrl.isEmpty()) && response.additionalImages != null
                && !response.additionalImages.isEmpty()) {
            imageUrl = response.additionalImages.get(0); // fallback image
        }
        
        dto.setObjectID(String.valueOf(id));
        dto.setTitle(response.title);
        dto.setArtist(response.artistDisplayName);
        dto.setMedium(response.medium);
        dto.setObjectDate(response.objectDate);
        dto.setImageUrl(imageUrl);

        return dto;
    }

    // get random artworks for the artwork feed when there is no user interaction
    // data
    @Cacheable("randomArtworks")
    public List<ArtworkDto> getArtworks(String query) {
        List<Integer> ids = searchArtworks(query);

        return ids.stream()
                .limit(10)
                .map(this::getArtworkById)
                .filter(Objects::nonNull)
                .filter(a -> a.getImageUrl() != null && !a.getImageUrl().isEmpty())
                .collect(Collectors.toList());
    }

    // the met api object calls (each obkect is an artwork)
    @Cacheable("randomArtworks")
    public List<ArtworkDto> getRandomArtworks() {
        String url = "https://collectionapi.metmuseum.org/public/collection/v1/objects";
        var response = restTemplate.getForObject(url, MetAllObjectsResponse.class);

        if (response == null || response.objectIDs == null)
            return List.of();

        Collections.shuffle(response.objectIDs);
        return response.objectIDs.stream()
                .limit(10)
                .map(this::getArtworkById)
                .filter(Objects::nonNull)
                .filter(a -> a.getImageUrl() != null && !a.getImageUrl().isEmpty())
                .collect(Collectors.toList());
    }
}
