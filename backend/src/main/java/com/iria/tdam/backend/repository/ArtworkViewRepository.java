// ArtworkViewrepository.java
package com.iria.tdam.backend.repository;

import com.iria.tdam.backend.model.ArtworkView;
import com.iria.tdam.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArtworkViewRepository extends JpaRepository<ArtworkView, Long> {
    
    List<ArtworkView> findByUser(User user);
    
    List<ArtworkView> findByUserAndArtworkId(User user, String artworkId);
    
    long countByUserAndArtworkId(User user, String artworkId);
}