package com.studycow.config.security;

import com.studycow.config.jwt.JwtAuthFilter;
import com.studycow.config.jwt.JwtUtil;
import com.studycow.service.user.CustomUserDetailService;
import jakarta.servlet.DispatcherType;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.http.auth.AUTH;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.www.BasicAuthenticationEntryPoint;
import org.springframework.web.cors.CorsConfiguration;

/**
 * Spring Security 설정
 * <pre>
 *     Session 인증 비활성화 + Jwt 필터 체인 추가
 * </pre>
 * @author 채기훈
 * @since JDK17
 */

@Configuration
@EnableWebSecurity // HTTP 요청에 대한 인증 및 인가 구성
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private static final String[] AUTH_WHITELIST = {
            "/api/v1/user/**", "/swagger-ui/**", "/api-docs", "/swagger-ui-custom.html",
            "/v3/api-docs/**", "/api-docs/**", "/swagger-ui.html", "/api/v1/auth/login",
            "/login","/swagger-ui.html#/**"
    };

    private final CustomUserDetailService userDetailService;
    private final JwtUtil jwtUtil;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(request -> new CorsConfiguration().applyPermitDefaultValues()))
                .sessionManagement(sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(new JwtAuthFilter(userDetailService, jwtUtil), UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .authenticationEntryPoint(authenticationEntryPoint())
                        .accessDeniedHandler(accessDeniedHandler()))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(AUTH_WHITELIST).permitAll()
                        .anyRequest().authenticated());

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class).build();
    }



    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider(PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return (request, response, authException) ->
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
    }

    @Bean
    public AccessDeniedHandler accessDeniedHandler() {
        return (request, response, accessDeniedException) ->
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "권한이 없습니다.");
    }
}