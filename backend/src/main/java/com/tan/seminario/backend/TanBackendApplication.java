package com.tan.seminario.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication(exclude = {org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class})
public class TanBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(TanBackendApplication.class, args);
		System.out.println(" La API está corriendo en: http://localhost:8080");
	}
}
