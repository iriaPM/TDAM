package com.iria.tdam.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.stream.Collectors;
import com.iria.tdam.backend.dto.ArtworkDto;

@Service
public class ArtworkService {
    private final RestTemplate restTemplate = new RestTemplate();

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
        dto.setObjectID(String.valueOf(id));
        dto.setTitle(response.title);
        dto.setArtist(response.artistDisplayName);
        dto.setMedium(response.medium);
        dto.setObjectDate(response.objectDate);
        dto.setImageUrl(response.primaryImageSmall);

        return dto;
    }

    public List<ArtworkDto> getArtworks(String query) {
        List<Integer> ids = searchArtworks(query);

        // Limit to first 10 items (to avoid API overload)
        return ids.stream()
                .limit(10)
                .map(this::getArtworkById)
                .collect(Collectors.toList());
    }
}
