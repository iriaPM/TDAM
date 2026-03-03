// ArtistService
// Service layer for fetching artist details and artworks from the Met and Harvard APIs
package com.iria.tdam.backend.services;

import com.iria.tdam.backend.dto.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class ArtistService {

    @Value("${harvard.api.key}")
    private String harvardApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public ArtistDetailDto getArtistDetail(String artistName) {
        ArtistDetailDto dto = new ArtistDetailDto();
        dto.setName(artistName);
        dto.setWikipediaUrl(
                "https://en.wikipedia.org/wiki/" + artistName.replace(" ", "_"));

        List<ArtworkDto> artworks = new ArrayList<>();

        artworks.addAll(fetchFromMet(artistName, dto));
        artworks.addAll(fetchFromHarvard(artistName, dto));

        dto.setArtworks(artworks);
        return dto;
    }

    // Met
    private List<ArtworkDto> fetchFromMet(String artistName, ArtistDetailDto dto) {
        try {
            String encoded = URLEncoder.encode(artistName, StandardCharsets.UTF_8);
            String searchUrl = "https://collectionapi.metmuseum.org/public/collection/v1/search"
                    + "?artistOrCulture=true&q=" + encoded;

            MetSearchResponse search = restTemplate.getForObject(
                    searchUrl, MetSearchResponse.class);

            if (search == null || search.objectIDs == null)
                return List.of();

            List<ArtworkDto> results = new ArrayList<>();

            search.objectIDs.stream()
                    .limit(10)
                    .forEach(id -> {
                        try {
                            String detailUrl = "https://collectionapi.metmuseum.org/public/collection/v1/objects/" + id;

                            MetObjectResponse obj = restTemplate.getForObject(
                                    detailUrl, MetObjectResponse.class);

                            if (obj == null
                                    || obj.primaryImageSmall == null
                                    || obj.primaryImageSmall.isEmpty())
                                return;

                            // populate artist bio from first result that has it
                            if (dto.getBio() == null && obj.artistDisplayBio != null) {
                                dto.setBio(obj.artistDisplayBio);
                                dto.setNationality(obj.artistNationality);
                                dto.setBirthYear(obj.artistBeginDate);
                                dto.setDeathYear(obj.artistEndDate);
                            }

                            ArtworkDto a = new ArtworkDto();
                            a.setObjectID("met-" + id);
                            a.setTitle(obj.title);
                            a.setArtist(obj.artistDisplayName);
                            a.setObjectDate(obj.objectDate);
                            a.setImageUrl(obj.primaryImageSmall);
                            a.setMedium(obj.medium);
                            a.setDimensions(obj.dimensions);
                            a.setCulture(obj.culture);
                            a.setPeriod(obj.period);
                            a.setClassification(obj.classification);
                            a.setDepartment(obj.department);
                            a.setCreditLine(obj.creditLine);
                            a.setObjectURL(obj.objectURL);
                            a.setArtistNationality(obj.artistNationality);
                            a.setSource("Met");
                            results.add(a);

                        } catch (Exception e) {
                            System.err.println("Failed to fetch Met object: " + id);
                        }
                    });

            return results;

        } catch (Exception e) {
            System.err.println("Met artist search failed: " + e.getMessage());
            return List.of();
        }
    }

    // Harvard 
    private List<ArtworkDto> fetchFromHarvard(String artistName, ArtistDetailDto dto) {
        try {
            String encoded = URLEncoder.encode(artistName, StandardCharsets.UTF_8);
            String url = String.format(
                    "https://api.harvardartmuseums.org/object"
                            + "?apikey=%s&hasimage=1&size=10&person=%s",
                    harvardApiKey, encoded);

            HarvardApiResponse response = restTemplate.getForObject(
                    url, HarvardApiResponse.class);

            if (response == null || response.records == null)
                return List.of();

            List<ArtworkDto> results = new ArrayList<>();

            for (HarvardArtwork r : response.records) {
                String imageUrl = r.primaryimageurl;
                if ((imageUrl == null || imageUrl.isEmpty())
                        && r.images != null && !r.images.isEmpty()) {
                    imageUrl = r.images.get(0).baseimageurl;
                }
                if (imageUrl == null || imageUrl.isEmpty())
                    continue;

                // populate bio from Harvard if Met didn't provide it
                if (dto.getBio() == null
                        && r.people != null
                        && !r.people.isEmpty()
                        && r.people.get(0).culture != null) {
                    dto.setNationality(r.people.get(0).culture);
                }

                ArtworkDto a = new ArtworkDto();
                a.setObjectID("harvard-" + r.id);
                a.setTitle(r.title);
                a.setObjectDate(r.dated);
                a.setImageUrl(imageUrl);
                a.setMedium(r.medium);
                a.setDimensions(r.dimensions);
                a.setCulture(r.culture);
                a.setPeriod(r.period);
                a.setClassification(r.classification);
                a.setDepartment(r.department);
                a.setCreditLine(r.creditline);
                a.setObjectURL(r.url);
                a.setSource("Harvard");

                if (r.people != null && !r.people.isEmpty()) {
                    a.setArtist(r.people.get(0).name);
                    a.setArtistNationality(r.people.get(0).culture);
                }

                results.add(a);
            }

            return results;

        } catch (Exception e) {
            System.err.println("Harvard artist search failed: " + e.getMessage());
            return List.of();
        }
    }
}