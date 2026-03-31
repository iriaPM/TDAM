package com.iria.tdam.backend;

import com.iria.tdam.backend.dto.ArtworkDto;
import com.iria.tdam.backend.dto.HarvardApiResponse;
import com.iria.tdam.backend.dto.HarvardArtwork;
import com.iria.tdam.backend.services.HarvardArtworkService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class HarvardArtworkServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private HarvardArtworkService harvardArtworkService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(harvardArtworkService, "restTemplate", restTemplate);
        ReflectionTestUtils.setField(harvardArtworkService, "harvardApiKey", "test-key");
    }

    @Test
    void searchArtworks_returnsArtworksFromApi() {
        HarvardArtwork artwork = new HarvardArtwork();
        artwork.id = "123";
        artwork.title = "Water Lilies";
        artwork.primaryimageurl = "http://img.jpg";

        HarvardApiResponse response = new HarvardApiResponse();
        response.records = List.of(artwork);

        when(restTemplate.getForObject(contains("title=lilies"), eq(HarvardApiResponse.class)))
                .thenReturn(response);

        List<ArtworkDto> result = harvardArtworkService.searchArtworks("lilies");

        assertEquals(1, result.size());
        assertEquals("Water Lilies", result.get(0).getTitle());
        assertEquals("harvard-123", result.get(0).getObjectID());
    }

    //  getArtworkById 

    @Test
    void getArtworkById_returnsArtworkDto() {
        HarvardArtwork artwork = new HarvardArtwork();
        artwork.id = "456";
        artwork.title = "The Scream";
        artwork.primaryimageurl = "http://img.jpg";

        when(restTemplate.getForObject(contains("456"), eq(HarvardArtwork.class)))
                .thenReturn(artwork);

        ArtworkDto result = harvardArtworkService.getArtworkById(456);

        assertNotNull(result);
        assertEquals("The Scream", result.getTitle());
        assertEquals("harvard-456", result.getObjectID());
    }
}