//collection artwork model
//represents an artwork within a collection

package com.iria.tdam.backend.model;

import jakarta.persistence.*;

@Entity
@Table( name = "collection_artworks", 
        uniqueConstraints = @UniqueConstraint(columnNames = { "collection_id",
        "artworkId" })
    )
public class CollectionArtwork {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "collection_id", nullable = false)
    private Collection collection;

    @Column
    private String artworkId;

    @Column
    private String imageUrl;

    // getters & setters
    public void setCollection(Collection collection) {
        this.collection = collection;
    }

    public void setArtworkId(String artworkId) {
        this.artworkId = artworkId;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getArtworkId() {
        return artworkId;
    }

    public String getImageUrl() {
        return imageUrl;
    }
}