//mlInteractionDto.java
//dto to define structure of the dataset export for the ML model training
package com.iria.tdam.backend.dto;

public class MlInteractionDto {

    //  Interaction 
    private Long userId;
    private String artworkId;
    private int liked;

    //  Artwork metadata 
    private String artist;
    private String period;
    private String culture;
    private String medium;

    //  User survey preferences 
    private String preferredArtists;
    private String preferredStyles;
    private String preferredMediums;
    private String preferredTimePeriods;
    private String preferredMovements;
    private boolean hasCompletedSurvey;

    public MlInteractionDto(
            Long userId,
            String artworkId,
            int liked,
            String artist,
            String period,
            String culture,
            String medium,
            String preferredArtists,
            String preferredStyles,
            String preferredMediums,
            String preferredTimePeriods,
            String preferredMovements,
            boolean hasCompletedSurvey) {

        this.userId = userId;
        this.artworkId = artworkId;
        this.liked = liked;

        this.artist = artist;
        this.period = period;
        this.culture = culture;
        this.medium = medium;

        this.preferredArtists = preferredArtists;
        this.preferredStyles = preferredStyles;
        this.preferredMediums = preferredMediums;
        this.preferredTimePeriods = preferredTimePeriods;
        this.preferredMovements = preferredMovements;
        this.hasCompletedSurvey = hasCompletedSurvey;
    }

    //  Getters 
    public Long getUserId() { return userId; }
    public String getArtworkId() { return artworkId; }
    public int getLiked() { return liked; }

    public String getArtist() { return artist; }
    public String getPeriod() { return period; }
    public String getCulture() { return culture; }
    public String getMedium() { return medium; }

    public String getPreferredArtists() { return preferredArtists; }
    public String getPreferredStyles() { return preferredStyles; }
    public String getPreferredMediums() { return preferredMediums; }
    public String getPreferredTimePeriods() { return preferredTimePeriods; }
    public String getPreferredMovements() { return preferredMovements; }
    public boolean isHasCompletedSurvey() { return hasCompletedSurvey; }
}