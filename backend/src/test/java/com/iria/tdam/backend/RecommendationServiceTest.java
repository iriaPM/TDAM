package com.iria.tdam.backend;

import com.iria.tdam.backend.services.RecommendationService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Map;

@ExtendWith(MockitoExtension.class)
public class RecommendationServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private RecommendationService recommendationService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(recommendationService, "restTemplate", restTemplate);
        ReflectionTestUtils.setField(recommendationService, "FLASK_URL", "http://localhost:5000");
    }

    //  getArtworkRecommendations 
    @Test
    void getArtworkRecommendations_returnsResponseBody() {
        Object mockBody = Map.of("recommendations", List.of());
        when(restTemplate.getForEntity(
                "http://localhost:5000/recommend/1?top_n=10", Object.class))
                .thenReturn(ResponseEntity.ok(mockBody));

        Object result = recommendationService.getArtworkRecommendations(1L, 10);

        assertNotNull(result);
    }

    @Test
    void getArtworkRecommendations_returnsNullIfServiceUnavailable() {
        when(restTemplate.getForEntity(anyString(), eq(Object.class)))
                .thenThrow(new RuntimeException("Connection refused"));

        Object result = recommendationService.getArtworkRecommendations(1L, 10);

        assertNull(result);
    }

    //  getCollectionRecommendations 
    @Test
    void getCollectionRecommendations_returnsResponseBody() {
        Object mockBody = Map.of("recommendations", List.of());
        when(restTemplate.getForEntity(
                "http://localhost:5000/recommend/collections/1?top_n=5", Object.class))
                .thenReturn(ResponseEntity.ok(mockBody));

        Object result = recommendationService.getCollectionRecommendations(1L, 5);

        assertNotNull(result);
    }

    @Test
    void getCollectionRecommendations_returnsNullIfServiceUnavailable() {
        when(restTemplate.getForEntity(anyString(), eq(Object.class)))
                .thenThrow(new RuntimeException("Connection refused"));

        Object result = recommendationService.getCollectionRecommendations(1L, 5);

        assertNull(result);
    }
}