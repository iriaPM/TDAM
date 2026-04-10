package com.iria.tdam.backend;

import com.iria.tdam.backend.model.ArtworkView;
import com.iria.tdam.backend.model.User;
import com.iria.tdam.backend.repository.ArtworkViewRepository;
import com.iria.tdam.backend.services.ArtworkService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ArtworkServiceTest {

    @Mock
    private ArtworkViewRepository artworkViewRepository;

    @InjectMocks
    private ArtworkService artworkService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setUsername("testuser");
    }

    //  recordArtworkView 
    @Test
    void recordArtworkView_savesViewToRepository() {
        when(artworkViewRepository.save(argThat(v ->
                v.getArtworkId().equals("met-123") && v.getUser().equals(mockUser))))
                .thenAnswer(i -> i.getArgument(0));

        artworkService.recordArtworkView(mockUser, "met-123");

        verify(artworkViewRepository).save(argThat(v ->
                v.getArtworkId().equals("met-123")));
    }

    @Test
    void recordArtworkView_acceptsHarvardArtworkId() {
        when(artworkViewRepository.save(argThat(v ->
                v.getArtworkId().equals("harvard-456"))))
                .thenAnswer(i -> i.getArgument(0));

        artworkService.recordArtworkView(mockUser, "harvard-456");

        verify(artworkViewRepository).save(argThat(v ->
                v.getArtworkId().equals("harvard-456")));
    }

    //  getViewCount 
    @Test
    void getViewCount_returnsCorrectCount() {
        when(artworkViewRepository.countByUserAndArtworkId(mockUser, "met-123")).thenReturn(5L);

        long result = artworkService.getViewCount(mockUser, "met-123");

        assertEquals(5L, result);
    }

    @Test
    void getViewCount_returnsZeroIfNeverViewed() {
        when(artworkViewRepository.countByUserAndArtworkId(mockUser, "met-999")).thenReturn(0L);

        long result = artworkService.getViewCount(mockUser, "met-999");

        assertEquals(0L, result);
    }

    //  getUserViewHistory 
    @Test
    void getUserViewHistory_returnsListOfViews() {
        ArtworkView view = new ArtworkView(mockUser, "met-123");
        when(artworkViewRepository.findByUser(mockUser)).thenReturn(List.of(view));

        List<ArtworkView> result = artworkService.getUserViewHistory(mockUser);

        assertEquals(1, result.size());
        assertEquals("met-123", result.get(0).getArtworkId());
    }

    @Test
    void getUserViewHistory_returnsEmptyListIfNoHistory() {
        when(artworkViewRepository.findByUser(mockUser)).thenReturn(List.of());

        List<ArtworkView> result = artworkService.getUserViewHistory(mockUser);

        assertTrue(result.isEmpty());
    }
}