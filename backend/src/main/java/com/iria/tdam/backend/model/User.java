//user model  aligned with frontended model 

package com.iria.tdam.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private String token;

    @Column(length = 500)
    private String description;

    private String avatarUrl;

    @Column(columnDefinition = "TEXT")
    private String preferredMovements;

    @Column(columnDefinition = "TEXT")
    private String preferredTimePeriods;

    @Column(columnDefinition = "TEXT")
    private String preferredStyles;

    @Column(columnDefinition = "TEXT")
    private String preferredArtists;

    @Column(columnDefinition = "TEXT")
    private String preferredMediums;

    @Column(nullable = false)
    private boolean hasCompletedSurvey = false;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
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

    public String getPreferredMovements() {
        return preferredMovements;
    }

    public void setPreferredMovements(String preferredMovements) {
        this.preferredMovements = preferredMovements;
    }

    public String getPreferredTimePeriods() {
        return preferredTimePeriods;
    }

    public void setPreferredTimePeriods(String preferredTimePeriods) {
        this.preferredTimePeriods = preferredTimePeriods;
    }

    public String getPreferredStyles() {
        return preferredStyles;
    }

    public void setPreferredStyles(String preferredStyles) {
        this.preferredStyles = preferredStyles;
    }

    public String getPreferredArtists() {
        return preferredArtists;
    }

    public void setPreferredArtists(String preferredArtists) {
        this.preferredArtists = preferredArtists;
    }

    public String getPreferredMediums() {
        return preferredMediums;
    }

    public void setPreferredMediums(String preferredMediums) {
        this.preferredMediums = preferredMediums;
    }

    public boolean isHasCompletedSurvey() {
        return hasCompletedSurvey;
    }

    public void setHasCompletedSurvey(boolean hasCompletedSurvey) {
        this.hasCompletedSurvey = hasCompletedSurvey;
    }
}
