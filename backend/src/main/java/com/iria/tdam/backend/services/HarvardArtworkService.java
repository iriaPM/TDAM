//harvard artwork service file
//in this file I have all the api calls needed for the artworks in harvard api 
package com.iria.tdam.backend.services;

import org.springframework.cache.annotation.CacheConfig;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;
import java.util.stream.Collectors;
import com.iria.tdam.backend.dto.ArtworkDto;
import com.iria.tdam.backend.dto.MetObjectResponse;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;


@Service
public class HarvardArtworkService {

    @Value("${harvard.api.key}")
    private String harvardApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    
}
