// UserProfileDto.java
package com.iria.tdam.backend.dto;

import java.util.List;

public class UserProfileDto {
    private Long id;
    private String userName;
    private String description;
    private String avatarUrl;
    private boolean isMe;
    private List<CollectionFeedDto> collections;

    // getters & setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public boolean isMe() {
        return isMe;
    }

    public void setMe(boolean me) {
        isMe = me;
    }

    public List<CollectionFeedDto> getCollections() {
        return collections;
    }

    public void setCollections(List<CollectionFeedDto> collections) {
        this.collections = collections;
    }
}