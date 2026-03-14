//artwork cache service.java
//to cache the artworks from the Apis to reduce latency and load on the APIs

package com.iria.tdam.backend.services;

import com.iria.tdam.backend.dto.ArtworkDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class ArtworkCacheService {

    @Autowired
    private ArtworkService artworkService;

    @Autowired
    private HarvardArtworkService harvardArtworkService;

    private List<ArtworkDto> cachedArtworks = new ArrayList<>();

    // runs once on startup
    @PostConstruct
    public void initCache() {
        refreshCache();
    }

    // refreshes every 30 minutes
    @Scheduled(fixedRate = 30 * 60 * 1000)
    public void refreshCache() {
        try {
            List<ArtworkDto> result = new ArrayList<>();
            result.addAll(artworkService.getRandomArtworks());
            result.addAll(harvardArtworkService.getRandomArtworks());
            Collections.shuffle(result);
            List<ArtworkDto> fresh = result.stream().limit(50).toList();
            if (!fresh.isEmpty()) {
                cachedArtworks = fresh;
                System.out.println("Artwork cache refreshed: " + cachedArtworks.size() + " artworks");
            }
        } catch (Exception e) {
            System.out.println("Cache refresh failed, keeping old cache: " + e.getMessage());
        }
    }

    public List<ArtworkDto> getCachedArtworks() {
        return cachedArtworks;
    }

    public ArtworkDto getArtworkById(String objectID) {
        return cachedArtworks.stream()
                .filter(a -> a.getObjectID().equals(objectID))
                .findFirst()
                .orElse(null);
    }
}