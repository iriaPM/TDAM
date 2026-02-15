package com.iria.tdam.backend.dto;

import java.util.*;

public class MetObjectResponse {
    // Basic info
    public String title;
    public String primaryImage;
    public String primaryImageSmall;
    public List<String> additionalImages;

    // Artist info
    public String artistDisplayName;
    public String artistDisplayBio;
    public String artistNationality;
    public String artistBeginDate;
    public String artistEndDate;

    // Date info
    public String objectDate;
    public Integer objectBeginDate;
    public Integer objectEndDate;

    // Physical properties
    public String medium;
    public String dimensions;

    // Cultural context
    public String culture;
    public String period;
    public String dynasty;
    public String classification;
    public String department;

    // Geography
    public String geographyType;
    public String city;
    public String state;
    public String country;
    public String region;

    // Institutional
    public String creditLine;
    public String objectURL;
    public String repository;
}