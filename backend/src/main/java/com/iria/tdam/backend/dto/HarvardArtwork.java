//harvard artwork dto file with all the fields needed from the harvard api
package com.iria.tdam.backend.dto;

import java.util.List;

public class HarvardArtwork {
    public String id;
    public String title;
    public String dated;
    public String medium;
    public String creditline;
    public String primaryimageurl;
    public List<Person> people;
    public List<Image> images;

    public static class Person {
        public String name;
    }

    public static class Image {
        public String baseimageurl;
    }
}
