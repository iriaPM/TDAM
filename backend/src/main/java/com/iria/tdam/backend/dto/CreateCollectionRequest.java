//CreateCollectionRequest.java
//dto for creating a new collection
package com.iria.tdam.backend.dto;

public class CreateCollectionRequest {

    private String title;
    private String description;
    private boolean isPrivate;

    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public boolean isPrivate() { return isPrivate; }
}
