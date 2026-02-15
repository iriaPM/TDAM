//collection repository
//data access layer for collections

package com.iria.tdam.backend.repository;

import com.iria.tdam.backend.model.Collection;
import com.iria.tdam.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CollectionRepository extends JpaRepository<Collection, UUID> {

    // all collections owned by a user
    List<Collection> findByOwner(User owner);

    // public collections for feed
    List<Collection> findByIsPrivateFalse();

    // single collection (used for detail view)
    Optional<Collection> findById(UUID id);

    // making sure collection belongs to user
    Optional<Collection> findByIdAndOwner(UUID id, User owner);

    // to find "all collections" collection
    Optional<Collection> findByOwnerAndTitle( User owner, String title);

}
