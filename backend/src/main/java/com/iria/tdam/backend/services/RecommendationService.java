//recommendationservice.java
package com.iria.tdam.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;

@Service
public class RecommendationService {

    private final RestTemplate restTemplate = new RestTemplate();
    @Value("${flask.url}")
    private String FLASK_URL;

    public Object getArtworkRecommendations(Long userId, int topN, String category) {
        try {
            String url = FLASK_URL + "/recommend/" + userId + "?top_n=" + topN;
            if (category != null && !category.isEmpty()) {
                url += "&category=" + java.net.URLEncoder.encode(category, java.nio.charset.StandardCharsets.UTF_8);
            }
            ResponseEntity<Object> response = restTemplate.getForEntity(url, Object.class);
            return response.getBody();
        } catch (Exception e) {
            System.out.println("ML service unavailable: " + e.getMessage());
            return null;
        }
    }

    public Object getUserCategories(Long userId) {
        try {
            String url = FLASK_URL + "/user/" + userId + "/categories";
            ResponseEntity<Object> response = restTemplate.getForEntity(url, Object.class);
            return response.getBody();
        } catch (Exception e) {
            System.out.println("ML service unavailable for categories: " + e.getMessage());
            return null;
        }
    }

    public Object getCollectionRecommendations(Long userId, int topN) {
        try {
            String url = FLASK_URL + "/recommend/collections/" + userId + "?top_n=" + topN;
            ResponseEntity<Object> response = restTemplate.getForEntity(url, Object.class);
            return response.getBody();
        } catch (Exception e) {
            System.out.println("ML service unavailable: " + e.getMessage());
            return null;
        }
    }
}