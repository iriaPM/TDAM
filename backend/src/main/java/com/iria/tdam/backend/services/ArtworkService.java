//artwork service file
//in this file I have all the api calls needed for the artworks
package com.iria.tdam.backend.services;

import org.springframework.cache.annotation.CacheConfig;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;
import com.iria.tdam.backend.dto.ArtworkDto;
import com.iria.tdam.backend.dto.MetObjectResponse;
import org.springframework.cache.annotation.Cacheable;
import com.iria.tdam.backend.repository.ArtworkViewRepository;
import com.iria.tdam.backend.model.ArtworkView;
import com.iria.tdam.backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;

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

        // Basic fields
        dto.setObjectID("met-" + id);
        dto.setTitle(response.title);
        dto.setArtist(response.artistDisplayName);
        dto.setImageUrl(imageUrl);
        dto.setSource("Met");

        // Date fields
        dto.setObjectDate(response.objectDate);
        dto.setObjectBeginDate(response.objectBeginDate);
        dto.setObjectEndDate(response.objectEndDate);

        // Physical properties
        dto.setMedium(response.medium);
        dto.setDimensions(response.dimensions);

        // Artist details
        dto.setArtistBio(response.artistDisplayBio);
        dto.setArtistNationality(response.artistNationality);

        // Cultural context
        dto.setCulture(response.culture);
        dto.setPeriod(response.period);
        dto.setDynasty(response.dynasty);
        dto.setClassification(response.classification);
        dto.setDepartment(response.department);

        // Geography
        dto.setGeographyType(response.geographyType);
        dto.setCity(response.city);
        dto.setCountry(response.country);
        dto.setRegion(response.region);

        // Institutional
        dto.setCreditLine(response.creditLine);
        dto.setObjectURL(response.objectURL);
        dto.setRepository(response.repository);

        return dto;
    }

    // --- Search results
    @Cacheable(value = "searchArtworks", key = "#query")
    public List<ArtworkDto> getArtworks(String query) {
        List<Integer> ids = searchArtworks(query);
        if (ids.isEmpty())
            return List.of();

        return ids.stream()
                .limit(10)
                .map(this::getArtworkById)
                .filter(Objects::nonNull)
                .toList();
    }

    // --- Random artworks
    @Cacheable("randomArtworks")
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
                .limit(10)
                .toList();
    }

    @Autowired
    private ArtworkViewRepository artworkViewRepository;

    public void recordArtworkView(User user, String artworkId) {
        ArtworkView view = new ArtworkView(user, artworkId);
        artworkViewRepository.save(view);

        System.out.println("Recorded view: User " + user.getUsername() + " viewed " + artworkId);
    }

    public long getViewCount(User user, String artworkId) {
        return artworkViewRepository.countByUserAndArtworkId(user, artworkId);
    }

    public List<ArtworkView> getUserViewHistory(User user) {
        return artworkViewRepository.findByUser(user);
    }
}
