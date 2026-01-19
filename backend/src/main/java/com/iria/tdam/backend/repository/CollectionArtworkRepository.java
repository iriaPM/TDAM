//collection artwork repository
//data access layer for artworks within collections

package com.iria.tdam.backend.repository;

import com.iria.tdam.backend.model.Collection;
import com.iria.tdam.backend.model.CollectionArtwork;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CollectionArtworkRepository extends JpaRepository<CollectionArtwork, Long> {

    // all artworks inside a collection
    List<CollectionArtwork> findByCollection(Collection collection);

    // check if artwork already exists (toggle logic)
    Optional<CollectionArtwork> findByCollectionAndArtworkId(
            Collection collection,
            String artworkId);

    // remove artwork from collection
    void deleteByCollectionAndArtworkId(
            Collection collection,
            String artworkId);
}
