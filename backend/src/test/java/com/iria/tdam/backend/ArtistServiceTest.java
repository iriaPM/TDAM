package com.iria.tdam.backend;

import com.iria.tdam.backend.dto.ArtistDetailDto;
import com.iria.tdam.backend.services.ArtistService;
import com.iria.tdam.backend.services.MetSearchResponse;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ArtistServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private ArtistService artistService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(artistService, "restTemplate", restTemplate);
        ReflectionTestUtils.setField(artistService, "harvardApiKey", "test-key");
    }

    //  getArtistDetail 
    @Test
    void getArtistDetail_returnsCorrectNameAndWikipediaUrl() {
        when(restTemplate.getForObject(contains("metmuseum"), eq(MetSearchResponse.class)))
                .thenReturn(null);
        when(restTemplate.getForObject(contains("harvardartmuseums"), any()))
                .thenReturn(null);

        ArtistDetailDto result = artistService.getArtistDetail("Vincent van Gogh");

        assertEquals("Vincent van Gogh", result.getName());
        assertEquals("https://en.wikipedia.org/wiki/Vincent_van_Gogh", result.getWikipediaUrl());
    }

    @Test
    void getArtistDetail_returnsEmptyArtworksWhenBothApisFail() {
        when(restTemplate.getForObject(anyString(), any()))
                .thenThrow(new RuntimeException("API unavailable"));

        ArtistDetailDto result = artistService.getArtistDetail("Unknown Artist");

        assertNotNull(result);
        assertTrue(result.getArtworks().isEmpty());
    }

    @Test
    void getArtistDetail_wikipediaUrlReplacesSpacesWithUnderscores() {
        when(restTemplate.getForObject(anyString(), any())).thenReturn(null);

        ArtistDetailDto result = artistService.getArtistDetail("Claude Monet");

        assertEquals("https://en.wikipedia.org/wiki/Claude_Monet", result.getWikipediaUrl());
    }
}