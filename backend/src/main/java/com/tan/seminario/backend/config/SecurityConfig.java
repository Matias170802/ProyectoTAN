package com.tan.seminario.backend.config;

import com.tan.seminario.backend.Entity.Token;
import com.tan.seminario.backend.Repository.TokenRepository;
import com.tan.seminario.backend.config.security.RoleAuthorizationFilter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Slf4j
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
@Profile("prod")
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final RoleAuthorizationFilter roleAuthorizationFilter;
    private final AuthenticationProvider authenticationProvider;
    private final TokenRepository tokenRepository;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, AuthenticationProvider authenticationProvider) throws Exception {
        log.info("=================================================");
        log.info("SEGURIDAD HABILITADA - PERFIL: prod");
        log.info("JWT Y ROLES ACTIVOS");
        log.info("=================================================");

        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(req ->
                        req.requestMatchers("/auth/**") // Cualquiera puede acceder a los endpoints de autenticacion
                                .permitAll()
                                .anyRequest()
                                .authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(roleAuthorizationFilter, JwtAuthFilter.class) // Agregar filtro de roles después del JWT
                .logout(logout ->
                        logout.logoutUrl("auth/logout")
                                .addLogoutHandler((request, response, authentication) -> {
                                    final var authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
                                    logout(authHeader);
                                })
                                .logoutSuccessHandler((request, response, authentication) -> {
                                    SecurityContextHolder.clearContext();
                                })
                )
        ;
        return http.build();
    }

    private void logout(final String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Invalid token");
        }
        final String jwtToken = token.substring(7);
        final Token foundToken = tokenRepository.findByToken(jwtToken).orElseThrow(
                () -> new IllegalArgumentException("Token not found"));
        foundToken.setRevoked(true);
        foundToken.setExpired(true);
        tokenRepository.save(foundToken);
    }
}