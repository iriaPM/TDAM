//mlExportService.java
//service to generate dynamically the dataset for the ML model training
package com.iria.tdam.backend.services;

import com.iria.tdam.backend.dto.MlInteractionDto;
import com.iria.tdam.backend.dto.ArtworkDto;
import com.iria.tdam.backend.model.*;
import com.iria.tdam.backend.model.Collection;
import com.iria.tdam.backend.repository.*;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;

@Service
public class MLExportService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ArtworkViewRepository artworkViewRepository;

    @Autowired
    private CollectionRepository collectionRepository;

    @Autowired
    private CollectionArtworkRepository collectionArtworkRepository;

    @Autowired
    private ArtworkService artworkService;

    @Autowired
    private HarvardArtworkService harvardArtworkService;

    public List<MlInteractionDto> getDataset() {

        List<MlInteractionDto> dataset = new ArrayList<>();

        int positiveCount = 0;
        int negativeCount = 0;

        List<User> users = userRepository.findAll();

        for (User user : users) {

            Map<String, Integer> interactionMap = new HashMap<>();

            // saved (liked = 1)
            List<Collection> collections = collectionRepository.findByOwner(user);

            for (Collection collection : collections) {
                List<CollectionArtwork> artworks = collectionArtworkRepository.findByCollection(collection);

                for (CollectionArtwork ca : artworks) {
                    interactionMap.put(ca.getArtworkId(), 1);
                }
            }

            // views (liked = 0 if not saved)
            List<ArtworkView> views = artworkViewRepository.findByUser(user);

            for (ArtworkView view : views) {
                interactionMap.putIfAbsent(view.getArtworkId(), 0);
            }

            for (Map.Entry<String, Integer> entry : interactionMap.entrySet()) {

                String artworkId = entry.getKey();
                int liked = entry.getValue();

                ArtworkDto artwork = fetchArtworkMetadata(artworkId);
                if (artwork == null)
                    continue;

                dataset.add(new MlInteractionDto(
                        user.getId(),
                        artworkId,
                        liked,

                        safe(artwork.getArtist()),
                        safe(artwork.getPeriod()),
                        safe(artwork.getCulture()),
                        safe(artwork.getMedium()),

                        safe(user.getPreferredArtists()),
                        safe(user.getPreferredStyles()),
                        safe(user.getPreferredMediums()),
                        safe(user.getPreferredTimePeriods()),
                        safe(user.getPreferredMovements()),
                        user.isHasCompletedSurvey()));

                if (liked == 1)
                    positiveCount++;
                else
                    negativeCount++;
            }
        }

        System.out.println("ML DATASET GENERATED");
        System.out.println("Positive samples: " + positiveCount);
        System.out.println("Negative samples: " + negativeCount);

        return dataset;
    }

    private ArtworkDto fetchArtworkMetadata(String artworkId) {
        try {
            String[] parts = artworkId.split("-", 2);
            if (parts.length != 2)
                return null;

            String source = parts[0];
            String id = parts[1];

            if ("met".equalsIgnoreCase(source)) {
                return artworkService.getArtworkById(Integer.parseInt(id));
            } else if ("harvard".equalsIgnoreCase(source)) {
                return harvardArtworkService.getArtworkById(Integer.parseInt(id));
            }

        } catch (Exception e) {
            return null;
        }

        return null;
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}