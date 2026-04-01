package com.iria.tdam.backend;

import com.iria.tdam.backend.dto.CollectionDetailDto;
import com.iria.tdam.backend.dto.CollectionFeedDto;
import com.iria.tdam.backend.model.Collection;
import com.iria.tdam.backend.model.CollectionArtwork;
import com.iria.tdam.backend.model.User;
import com.iria.tdam.backend.repository.CollectionArtworkRepository;
import com.iria.tdam.backend.repository.CollectionRepository;
import com.iria.tdam.backend.services.CollectionService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;

@ExtendWith(MockitoExtension.class)
public class CollectionServiceTest {

        @Mock
        private CollectionRepository collectionRepository;

        @Mock
        private CollectionArtworkRepository artworkRepository;

        @InjectMocks
        private CollectionService collectionService;

        private User mockUser;
        private Collection mockCollection;
        private UUID mockCollectionId;

        @BeforeEach
        void setUp() {
                mockUser = new User();
                mockUser.setId(1L);
                mockUser.setUsername("testuser");

                mockCollectionId = UUID.randomUUID();

                mockCollection = new Collection();
                mockCollection.setTitle("Test Collection");
                mockCollection.setDescription("Test Description");
                mockCollection.setPrivate(false);
                mockCollection.setOwner(mockUser);
                mockCollection.setCreatedAt(LocalDateTime.now());
        }

        // createCollection
        @Test
        void createCollection_savesCollectionWithCorrectDetails() {
                when(collectionRepository.save(argThat(c -> c.getOwner().equals(mockUser))))
                                .thenAnswer(i -> (Collection) i.getArgument(0));

                Collection result = collectionService.createCollection(mockUser, "My Collection", "desc", false);

                assertEquals("My Collection", result.getTitle());
                assertEquals(mockUser, result.getOwner());
                assertFalse(result.isPrivate());
        }

        @Test
        void createCollection_acceptsEmojiInTitle() {
                when(collectionRepository.save(argThat(c -> c.getTitle().equals("🎨 My Art 🖼️"))))
                                .thenAnswer(i -> (Collection) i.getArgument(0));

                Collection result = collectionService.createCollection(mockUser, "🎨 My Art 🖼️", "desc", false);
                assertEquals("🎨 My Art 🖼️", result.getTitle());
        }

        // togglePrivacy
        @Test
        void togglePrivacy_makesPublicCollectionPrivate() {
                mockCollection.setPrivate(false);
                when(collectionRepository.findByIdAndOwner(mockCollection.getId(), mockUser))
                                .thenReturn(Optional.of(mockCollection));
                when(collectionRepository.save(mockCollection))
                                .thenAnswer(i -> (Collection) i.getArgument(0));

                collectionService.togglePrivacy(mockUser, mockCollection.getId());
                assertTrue(mockCollection.isPrivate());
        }

        @Test
        void togglePrivacy_throwsIfCollectionBelongsToDifferentUser() {
                User otherUser = new User();
                otherUser.setId(2L);

                when(collectionRepository.findByIdAndOwner(mockCollectionId, otherUser))
                                .thenReturn(Optional.empty());

                assertThrows(IllegalArgumentException.class,
                                () -> collectionService.togglePrivacy(otherUser, mockCollectionId));
                verify(collectionRepository, never()).save(any(Collection.class));
        }

        // updateCollection
        @Test
        void updateCollection_updatesTitle() {
                when(collectionRepository.findByIdAndOwner(mockCollection.getId(), mockUser))
                                .thenReturn(Optional.of(mockCollection));
                when(collectionRepository.save(mockCollection))
                                .thenAnswer(i -> (Collection) i.getArgument(0));

                Collection result = collectionService.updateCollection(
                                mockUser, mockCollection.getId(), "New Title", "New Description");

                assertEquals("New Title", result.getTitle());
                assertEquals("New Description", result.getDescription());
        }

        @Test
        void updateCollection_throwsIfCollectionNotFound() {
                when(collectionRepository.findByIdAndOwner(mockCollectionId, mockUser))
                                .thenReturn(Optional.empty());

                assertThrows(IllegalArgumentException.class,
                                () -> collectionService.updateCollection(mockUser, mockCollectionId, "Title", "Desc"));
                verify(collectionRepository, never()).save(any(Collection.class));
        }

        // toggleSavedArtwork
        @Test
        void toggleSavedArtwork_returnsTrueWhenArtworkSaved() {
                when(collectionRepository.findFirstByOwnerAndTitleOrderByCreatedAtAsc(mockUser, "All artworks"))
                                .thenReturn(Optional.of(mockCollection));
                when(artworkRepository.findByCollectionAndArtworkId(mockCollection, "met-123"))
                                .thenReturn(Optional.empty());
                when(artworkRepository.save(argThat(ca -> ca.getArtworkId().equals("met-123"))))
                                .thenAnswer(i -> (CollectionArtwork) i.getArgument(0));

                boolean result = collectionService.toggleSavedArtwork(mockUser, "met-123", "http://img.jpg");
                assertTrue(result);
        }

        @Test
        void toggleSavedArtwork_returnsFalseWhenArtworkRemoved() {
                CollectionArtwork existing = new CollectionArtwork();
                existing.setArtworkId("met-123");

                when(collectionRepository.findFirstByOwnerAndTitleOrderByCreatedAtAsc(mockUser, "All artworks"))
                                .thenReturn(Optional.of(mockCollection));
                when(artworkRepository.findByCollectionAndArtworkId(mockCollection, "met-123"))
                                .thenReturn(Optional.of(existing));

                boolean result = collectionService.toggleSavedArtwork(mockUser, "met-123", "http://img.jpg");

                assertFalse(result);
                verify(artworkRepository).delete(existing);
                verify(artworkRepository, never()).save(any(CollectionArtwork.class));
        }

        @Test
        void toggleSavedArtwork_createsAllArtworksCollectionIfNotExists() {
                when(collectionRepository.findFirstByOwnerAndTitleOrderByCreatedAtAsc(mockUser, "All artworks"))
                                .thenReturn(Optional.empty());
                when(collectionRepository.save(argThat(c -> c.getTitle().equals("All artworks"))))
                                .thenAnswer(i -> (Collection) i.getArgument(0));
                when(artworkRepository.findByCollectionAndArtworkId(
                                argThat(c -> c.getTitle().equals("All artworks")), eq("met-123")))
                                .thenReturn(Optional.empty());
                when(artworkRepository.save(argThat(ca -> ca.getArtworkId().equals("met-123"))))
                                .thenAnswer(i -> (CollectionArtwork) i.getArgument(0));

                boolean result = collectionService.toggleSavedArtwork(mockUser, "met-123", "http://img.jpg");

                assertTrue(result);
                verify(collectionRepository, atLeastOnce())
                                .save(argThat(c -> c.getTitle().equals("All artworks")));
        }

        // getPublicCollections
        @Test
        void getPublicCollections_returnsListOfFeedDtos() {
                mockCollection.setOwner(mockUser);
                when(collectionRepository.findByIsPrivateFalse())
                                .thenReturn(List.of(mockCollection));

                List<CollectionFeedDto> result = collectionService.getPublicCollections();

                assertNotNull(result);
                assertEquals(1, result.size());
                assertEquals("Test Collection", result.get(0).getTitle());
        }

        @Test
        void getPublicCollections_returnsEmptyListWhenNoneExist() {
                when(collectionRepository.findByIsPrivateFalse()).thenReturn(List.of());

                List<CollectionFeedDto> result = collectionService.getPublicCollections();

                assertNotNull(result);
                assertTrue(result.isEmpty());
        }

        // getUserCollections
        @Test
        void getUserCollections_returnsCollectionsForUser() {
                when(collectionRepository.findByOwner(mockUser))
                                .thenReturn(List.of(mockCollection));

                List<CollectionFeedDto> result = collectionService.getUserCollections(mockUser);

                assertEquals(1, result.size());
                assertEquals("Test Collection", result.get(0).getTitle());
        }

        // getCollectionDetail
        @Test
        void getCollectionDetail_returnsDetailDto() {
                mockUser.setId(1L);
                when(collectionRepository.findById(mockCollectionId))
                                .thenReturn(Optional.of(mockCollection));

                CollectionDetailDto result = collectionService.getCollectionDetail(mockCollectionId, mockUser);

                assertNotNull(result);
                assertEquals("Test Collection", result.getTitle());
        }

        // toggleArtwork
        @Test
        void toggleArtwork_addsArtworkIfNotInCollection() {
                Collection allArtworks = new Collection();
                allArtworks.setOwner(mockUser);
                when(collectionRepository.findFirstByOwnerAndTitleOrderByCreatedAtAsc(mockUser, "All artworks"))
                                .thenReturn(Optional.of(allArtworks));

                when(collectionRepository.findByIdAndOwner(mockCollectionId, mockUser))
                                .thenReturn(Optional.of(mockCollection));

                when(artworkRepository.findByCollectionAndArtworkId(mockCollection, "met-123"))
                                .thenReturn(Optional.empty());

                when(artworkRepository.findByCollectionAndArtworkId(allArtworks, "met-123"))
                                .thenReturn(Optional.empty());

                when(artworkRepository.save(argThat(ca -> ca.getArtworkId().equals("met-123"))))
                                .thenAnswer(i -> (CollectionArtwork) i.getArgument(0));

                collectionService.toggleArtwork(mockUser, mockCollectionId, "met-123", "http://img.jpg");

                verify(artworkRepository, times(2))
                                .save(argThat(ca -> ca.getArtworkId().equals("met-123")));
        }

        // getSavedArtworkIds
        @Test
        void getSavedArtworkIds_returnsSetOfIds() {
                CollectionArtwork ca = new CollectionArtwork();
                ca.setArtworkId("met-123");

                when(collectionRepository.findFirstByOwnerAndTitleOrderByCreatedAtAsc(mockUser, "All artworks"))
                                .thenReturn(Optional.of(mockCollection));
                when(artworkRepository.findByCollection(mockCollection))
                                .thenReturn(List.of(ca));

                Set<String> result = collectionService.getSavedArtworkIds(mockUser);

                assertEquals(1, result.size());
                assertTrue(result.contains("met-123"));
        }

        @Test
        void getSavedArtworkIds_returnsEmptySetIfNothingSaved() {
                when(collectionRepository.findFirstByOwnerAndTitleOrderByCreatedAtAsc(mockUser, "All artworks"))
                                .thenReturn(Optional.of(mockCollection));
                when(artworkRepository.findByCollection(mockCollection))
                                .thenReturn(List.of());

                Set<String> result = collectionService.getSavedArtworkIds(mockUser);

                assertTrue(result.isEmpty());
        }
}