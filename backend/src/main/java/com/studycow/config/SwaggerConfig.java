package com.studycow.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <pre>
 *     운영서버와 배포서버의 설정 분할을 위한 SwaggerConfig
 * </pre>
 * @author 채기훈
 * @since JDK17
 */
@Configuration
public class SwaggerConfig {

    @Value("${spring.profiles.active:unknown}")
    private String activeProfile;

    @Bean
    public OpenAPI customOpenAPI() {
        Server server;
        if ("prod".equals(activeProfile)) {
            server = new Server()
                    .url("https://i11c202.p.ssafy.io/studycow")
                    .description("운영 서버");
        } else {
            server = new Server()
                    .url("http://localhost:8080/studycow")
                    .description("개발 서버");
        }

        return new OpenAPI()
                .addServersItem(server)
                .info(apiInfo())
                .components(new Components()
                        .addSecuritySchemes("basicScheme",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("basic"))
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT"))
                ).addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
    }

    private Info apiInfo() {
        return new Info().title("Study Cow API 문서")
                .description("<h3>REST API 문서 내용을 다음과 같이 제공합니다.</h3>")
                .version("1.0.0")
                .license(new License().name("Apache 2.0").url("http://springdoc.org"));
    }
}