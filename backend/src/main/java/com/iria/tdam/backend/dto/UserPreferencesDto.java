// UserPreferencesDto.java
package com.iria.tdam.backend.dto;

import java.util.List;

public class UserPreferencesDto {
    private List<String> movements;
    private List<String> timePeriods;
    private List<String> styles;
    private List<String> artists;
    private List<String> mediums;

    // Getters and setters
    public List<String> getMovements() {
        return movements;
    }

    public void setMovements(List<String> movements) {
        this.movements = movements;
    }

    public List<String> getTimePeriods() {
        return timePeriods;
    }

    public void setTimePeriods(List<String> timePeriods) {
        this.timePeriods = timePeriods;
    }

    public List<String> getStyles() {
        return styles;
    }

    public void setStyles(List<String> styles) {
        this.styles = styles;
    }

    public List<String> getArtists() {
        return artists;
    }

    public void setArtists(List<String> artists) {
        this.artists = artists;
    }

    public List<String> getMediums() {
        return mediums;
    }

    public void setMediums(List<String> mediums) {
        this.mediums = mediums;
    }
}