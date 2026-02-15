//harvard artwork dto file with all the fields needed from the harvard api
package com.iria.tdam.backend.dto;

import java.util.List;

public class HarvardArtwork {
    public String id;
    public String title;
    public String dated;
    public String century;

    // Materials
    public String medium;
    public String technique;

    // Images
    public String primaryimageurl;
    public List<HarvardImage> images;

    // People/Artists
    public List<HarvardPerson> people;

    // Cultural context
    public String culture;
    public String period;
    public String classification;
    public String department;

    // Institutional
    public String creditline;
    public String url;
    public String division;

    // Physical
    public String dimensions;

    // Descriptive (often null in Harvard API)
    public String description;
    public String commentary;
    public String provenance;

    public static class HarvardImage {
        public String baseimageurl;
    }

    public static class HarvardPerson {
        public String name;
        public String role;
        public String culture;
    }
}