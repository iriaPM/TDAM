// ArtistDetailDto

package com.iria.tdam.backend.dto;

import java.util.*;

public class ArtistDetailDto {
    private String name;
    private String bio;
    private String nationality;
    private String birthYear;
    private String deathYear;
    private String wikipediaUrl;
    private List<ArtworkDto> artworks;

    // getters & setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public String getBirthYear() {
        return birthYear;
    }

    public void setBirthYear(String birthYear) {
        this.birthYear = birthYear;
    }

    public String getDeathYear() {
        return deathYear;
    }

    public void setDeathYear(String deathYear) {
        this.deathYear = deathYear;
    }

    public String getWikipediaUrl() {
        return wikipediaUrl;
    }

    public void setWikipediaUrl(String wikipediaUrl) {
        this.wikipediaUrl = wikipediaUrl;
    }

    public List<ArtworkDto> getArtworks() {
        return artworks;
    }

    public void setArtworks(List<ArtworkDto> artworks) {
        this.artworks = artworks;
    }
}