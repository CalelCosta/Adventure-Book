package com.pictet.adventure.infra.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI adventureOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Adventure Book Engine API")
                        .description("Backend services for interactive adventure game books")
                        .version("1.0.0"));
    }
}