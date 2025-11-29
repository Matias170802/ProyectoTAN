package com.tan.seminario.backend.config;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios.JwtService;
import com.tan.seminario.backend.Entity.Token;
import com.tan.seminario.backend.Entity.Usuario;
import com.tan.seminario.backend.Repository.TokenRepository;
import com.tan.seminario.backend.Repository.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
@Profile("prod")
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final TokenRepository tokenRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // Permitir acceso público a /auth
        if (request.getServletPath().contains("/auth")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        // Si no hay token, dejar que Spring Security maneje el 401
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String jwtToken = authHeader.substring(7);
            final String userEmail = jwtService.extractUsername(jwtToken);

            // Token mal formado - 401
            if (userEmail == null) {
                log.warn("Token mal formado - no se pudo extraer el email");
                sendUnauthorizedError(response, "Token inválido");
                return;
            }

            // Ya está autenticado en este request
            if (SecurityContextHolder.getContext().getAuthentication() != null) {
                filterChain.doFilter(request, response);
                return;
            }

            // Verificar si el token existe en BD y está activo
            final Token token = tokenRepository.findByToken(jwtToken).orElse(null);

            if (token == null) {
                log.warn("Token no encontrado en la base de datos");
                sendUnauthorizedError(response, "Token inválido");
                return;
            }

            if (token.isExpired()) {
                log.warn("Token expirado para usuario: {}", userEmail);
                sendUnauthorizedError(response, "Token expirado");
                return;
            }

            if (token.isRevoked()) {
                log.warn("Token revocado para usuario: {}", userEmail);
                sendUnauthorizedError(response, "Token revocado");
                return;
            }

            // Cargar usuario
            final UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
            final Optional<Usuario> user = usuarioRepository.findByEmail(userDetails.getUsername());

            if (user.isEmpty()) {
                log.warn("Usuario no encontrado: {}", userEmail);
                sendUnauthorizedError(response, "Usuario no encontrado");
                return;
            }

            // Verificar que el usuario esté activo
            if (!user.get().getActivo()) {
                log.warn("Cuenta inactiva para usuario: {}", userEmail);
                sendUnauthorizedError(response, "Cuenta inactiva");
                return;
            }

            // Validar firma del token
            final boolean isTokenValid = jwtService.isTokenValid(jwtToken, user.get());
            if (!isTokenValid) {
                log.warn("Firma del token inválida para usuario: {}", userEmail);
                sendUnauthorizedError(response, "Token inválido");
                return;
            }

            // Token válido - autenticar usuario
            log.debug("Usuario autenticado correctamente: {}", userEmail);
            final var authToken = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()
            );
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);

        } catch (Exception e) {
            log.error("Error al procesar token JWT", e);
            sendUnauthorizedError(response, "Error al procesar token");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void sendUnauthorizedError(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(String.format(
                "{\"error\": \"Unauthorized\", \"message\": \"%s\", \"statusCode\": 401}",
                message
        ));
    }
}