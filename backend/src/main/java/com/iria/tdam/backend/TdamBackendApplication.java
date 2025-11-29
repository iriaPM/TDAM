package com.iria.tdam.backend;

import org.springframework.cache.annotation.EnableCaching;  
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@EnableCaching
@SpringBootApplication
public class TdamBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(TdamBackendApplication.class, args);
	}

}
