//harvard artwork service file
//in this file I have all the api calls needed for the artworks in harvard api 
package com.iria.tdam.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;
import com.iria.tdam.backend.dto.ArtworkDto;
import com.iria.tdam.backend.dto.HarvardApiResponse;
import com.iria.tdam.backend.dto.HarvardArtwork;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;

@Service
public class HarvardArtworkService {
    @Value("${harvard.api.key}")
    private String harvardApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @Cacheable("harvardRandomArtworks")
    public List<ArtworkDto> getRandomArtworks() {
        String url = String.format(
                "https://api.harvardartmuseums.org/object?apikey=%s&hasimage=1&size=10",
                harvardApiKey);

        HarvardApiResponse response = restTemplate.getForObject(url, HarvardApiResponse.class);

        if (response == null || response.records == null)
            return List.of();

        return response.records.stream()
                .map(this::mapToArtworkDto)
                .filter(Objects::nonNull)
                .toList();
    }

    private ArtworkDto mapToArtworkDto(HarvardArtwork artwork) {
        String imageUrl = artwork.primaryimageurl;
        if ((imageUrl == null || imageUrl.isEmpty())
                && artwork.images != null
                && !artwork.images.isEmpty()) {
            imageUrl = artwork.images.get(0).baseimageurl;
        }

        if (imageUrl == null || imageUrl.isEmpty()) {
            return null;
        }

        ArtworkDto dto = new ArtworkDto();

        // Basic fields
        dto.setObjectID("harvard-" + artwork.id);
        dto.setTitle(artwork.title);
        dto.setImageUrl(imageUrl);
        dto.setSource("Harvard");

        // Date fields
        dto.setObjectDate(artwork.dated);
        dto.setCentury(artwork.century);

        // Physical properties
        dto.setMedium(artwork.medium);
        dto.setTechnique(artwork.technique);
        dto.setDimensions(artwork.dimensions);

        // Artist info
        if (artwork.people != null && !artwork.people.isEmpty()) {
            dto.setArtist(artwork.people.get(0).name);
            if (artwork.people.get(0).culture != null) {
                dto.setArtistNationality(artwork.people.get(0).culture);
            }
        } else {
            dto.setArtist("Unknown");
        }

        // Cultural context
        dto.setCulture(artwork.culture);
        dto.setPeriod(artwork.period);
        dto.setClassification(artwork.classification);
        dto.setDepartment(artwork.department);

        // Institutional
        dto.setCreditLine(artwork.creditline);
        dto.setObjectURL(artwork.url);
        dto.setRepository(artwork.division != null ? artwork.division : "Harvard Art Museums");

        // Descriptive text (often null in Harvard API)
        dto.setDescription(artwork.description);
        dto.setCommentary(artwork.commentary);
        dto.setProvenance(artwork.provenance);

        return dto;
    }

    @Cacheable(value = "harvardSearchArtworks", key = "#query")
    public List<ArtworkDto> searchArtworks(String query) {
        String url = String.format(
                "https://api.harvardartmuseums.org/object?apikey=%s&hasimage=1&size=10&title=%s",
                harvardApiKey,
                query);

        HarvardApiResponse response = restTemplate.getForObject(url, HarvardApiResponse.class);

        if (response == null || response.records == null)
            return List.of();

        return response.records.stream()
                .map(this::mapToArtworkDto)
                .filter(Objects::nonNull)
                .toList();
    }

    public ArtworkDto getArtworkById(int id) {
        String url = String.format(
                "https://api.harvardartmuseums.org/object/%d?apikey=%s",
                id,
                harvardApiKey);

        try {
            HarvardArtwork response = restTemplate.getForObject(url, HarvardArtwork.class);

            if (response == null) {
                return null;
            }

            return mapToArtworkDto(response);
        } catch (Exception e) {
            System.err.println("Failed to fetch Harvard artwork: " + id);
            e.printStackTrace();
            return null;
        }
    }
}
