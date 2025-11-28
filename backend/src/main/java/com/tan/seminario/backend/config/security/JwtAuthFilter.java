package com.tan.seminario.backend.config.security;

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

@Component
@RequiredArgsConstructor
// OncePerRequestFilter -> cada vez que se hace una peticion al server
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
        // Cada vez que se hace una peticion, se va a ejecutar este código
        // Queremos que cada peticion que no sea pública (Auth) sea validada según sus permisos
        // Si la peticion se hace al recurso /auth, entonces no se valida y se pasa al siguiente filtro
        if (request.getServletPath().contains("/auth")) {
            filterChain.doFilter(request, response);
            return;
        }
        // Verificar si el header de la req no contiene Bearer. Si contiene Bearer, entonces se valida el token
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Si el header contiene Bearer, entonces se extrae el token
        final String jwtToken = authHeader.substring(7); //obtengo el token sin el Bearer
        final String userEmail = jwtService.extractUsername(jwtToken); // obtengo el email del usuario
        if (userEmail == null || SecurityContextHolder.getContext().getAuthentication() != null) {
            return;
        }

        final Token token = tokenRepository.findByToken(jwtToken)
                .orElse(null);
        //Si el token es null, está expirado o revocado, entonces no se valida la peticion
        if (token == null || token.isExpired() || token.isRevoked()) {
            filterChain.doFilter(request, response);
            return;
        }

        // Obtener el usuario por el Email. Si no lo encuentra, entonces no puede entrar.
        final UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
        final Optional<Usuario> user = usuarioRepository.findByEmail(userDetails.getUsername());
        if (user.isEmpty()) {
            filterChain.doFilter(request, response);
            return;
        }

        // Validar los tokens
        final boolean idTokenValid = jwtService.isTokenValid(jwtToken, user.get());
        if (!idTokenValid) {
            return;
        }

        // Autenticar al usuario en el contexto de Spring
        final var authToken = new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );
        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authToken);
        filterChain.doFilter(request, response);
    }
}